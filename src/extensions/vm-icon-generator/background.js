// Chrome Debugger API to inject prompt into ChatGPT

function debuggerAttach(target) {
  return new Promise((resolve, reject) => {
    chrome.debugger.attach(target, '1.3', () => {
      if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
      else resolve();
    });
  });
}

function debuggerDetach(target) {
  return new Promise(resolve => chrome.debugger.detach(target, () => resolve()));
}

function debuggerCommand(target, method, params = {}) {
  return new Promise((resolve, reject) => {
    chrome.debugger.sendCommand(target, method, params, result => {
      if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
      else resolve(result);
    });
  });
}

async function sendPromptViaDebugger(tabId, text) {
  const target = { tabId };
  await debuggerAttach(target);
  
  try {
    // Focus input
    await debuggerCommand(target, 'Runtime.evaluate', {
      expression: '(()=>{const i=document.querySelector(\'#prompt-textarea,[contenteditable="true"]\');if(i){i.focus();return true}return false})()',
      returnByValue: true
    });
    
    // Clear existing text (Ctrl+A, Backspace)
    await debuggerCommand(target, 'Input.dispatchKeyEvent', { 
      type: 'keyDown', key: 'a', code: 'KeyA', 
      windowsVirtualKeyCode: 65, nativeVirtualKeyCode: 65, modifiers: 2 
    });
    await debuggerCommand(target, 'Input.dispatchKeyEvent', { 
      type: 'keyUp', key: 'a', code: 'KeyA', 
      windowsVirtualKeyCode: 65, nativeVirtualKeyCode: 65, modifiers: 2 
    });
    await debuggerCommand(target, 'Input.dispatchKeyEvent', { 
      type: 'keyDown', key: 'Backspace', code: 'Backspace', 
      windowsVirtualKeyCode: 8, nativeVirtualKeyCode: 8 
    });
    await debuggerCommand(target, 'Input.dispatchKeyEvent', { 
      type: 'keyUp', key: 'Backspace', code: 'Backspace', 
      windowsVirtualKeyCode: 8, nativeVirtualKeyCode: 8 
    });
    
    // Insert prompt text
    await debuggerCommand(target, 'Input.insertText', { text });
    
    // Add space to trigger button enable
    await new Promise(resolve => setTimeout(resolve, 300));
    await debuggerCommand(target, 'Input.dispatchKeyEvent', { 
      type: 'keyDown', key: ' ', code: 'Space', text: ' ', 
      windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 
    });
    await debuggerCommand(target, 'Input.dispatchKeyEvent', { 
      type: 'char', key: ' ', text: ' ' 
    });
    await debuggerCommand(target, 'Input.dispatchKeyEvent', { 
      type: 'keyUp', key: ' ', code: 'Space', 
      windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ok: true };
    
  } finally {
    await debuggerDetach(target);
  }
}

function execInMain(tabId, func) {
  return chrome.scripting.executeScript({ 
    target: { tabId }, 
    world: 'MAIN', 
    func 
  })
  .then(results => results?.[0]?.result ?? null)
  .catch(err => ({ __error: err.message }));
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  
  if (msg?.type === 'SEND_PROMPT') {
    if (!tabId) {
      sendResponse({ ok: false, error: 'No sender tab' });
      return true;
    }
    
    console.log('[VMIconGen][bg] SEND_PROMPT', { tabId, length: msg.text?.length });
    
    (async () => {
      try {
        const result = await sendPromptViaDebugger(tabId, msg.text);
        
        // Click submit button
        await new Promise(resolve => setTimeout(resolve, 500));
        const clicked = await execInMain(tabId, () => {
          const btn = document.querySelector('button[data-testid="send-button"],button[aria-label="Send prompt"]');
          if (btn && !btn.disabled) {
            btn.click();
            return true;
          }
          return false;
        });
        
        sendResponse({ ok: true, clicked });
        
      } catch (error) {
        sendResponse({ ok: false, error: error.message });
      }
    })();
    
    return true; // Keep channel open for async
  }
});
