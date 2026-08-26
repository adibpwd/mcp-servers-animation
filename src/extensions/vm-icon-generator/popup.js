const generateBtn = document.getElementById('generate');
const statusEl = document.getElementById('status');
const previewEl = document.getElementById('preview');

function setStatus(text) {
  statusEl.textContent = text;
  console.log('[VMIconGen]', text);
}

function addStatus(text) {
  statusEl.textContent += '\n' + text;
  statusEl.scrollTop = statusEl.scrollHeight;
}

generateBtn.addEventListener('click', async () => {
  generateBtn.disabled = true;
  setStatus('Starting icon generation...');
  
  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error('No active tab found');
    
    // Check if ChatGPT page
    if (!tab.url?.includes('chatgpt.com') && !tab.url?.includes('chat.openai.com')) {
      throw new Error('Please open ChatGPT page first');
    }
    
    addStatus('Triggering generation in content script...');
    
    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'START_GENERATION' });
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    addStatus('Generation started successfully!');
    addStatus('Wait for ChatGPT to generate image...');
    
  } catch (error) {
    addStatus('ERROR: ' + error.message);
    console.error(error);
  } finally {
    generateBtn.disabled = false;
  }
});

// Listen for status updates from content script
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'STATUS_UPDATE') {
    addStatus(msg.text);
  }
  if (msg.type === 'GENERATION_COMPLETE') {
    addStatus('✅ Generation complete!');
    addStatus(`Icons saved: ${msg.icons.join(', ')}`);
    generateBtn.disabled = false;
  }
  if (msg.type === 'GENERATION_ERROR') {
    addStatus('❌ Error: ' + msg.error);
    generateBtn.disabled = false;
  }
});
