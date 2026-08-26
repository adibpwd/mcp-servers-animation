const ICONS_JSON_URL = 'http://localhost:3000/api/icons/metadata';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function sendStatus(text) {
  chrome.runtime.sendMessage({ type: 'STATUS_UPDATE', text });
  console.log('[VMIconGen][content]', text);
}

// Listen for START_GENERATION message from popup
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === 'START_GENERATION') {
    try {
      await runGeneration();
      sendResponse({ ok: true });
    } catch (error) {
      sendResponse({ ok: false, error: error.message });
      chrome.runtime.sendMessage({ type: 'GENERATION_ERROR', error: error.message });
    }
    return true; // Keep channel open for async
  }
});

async function runGeneration() {
  sendStatus('Fetching icons metadata...');
  
  // Fetch icons.json metadata
  const metaRes = await fetch(ICONS_JSON_URL);
  if (!metaRes.ok) throw new Error('Failed to fetch icons metadata');
  const metadata = await metaRes.json();
  
  sendStatus(`Metadata loaded: ${metadata.icons.length} icons`);
  
  const prompt = metadata.generation.prompt;
  if (!prompt) throw new Error('No prompt in metadata');
  
  sendStatus('Sending prompt to ChatGPT...');
  
  // Get image sources before sending prompt
  const beforeSources = new Set([...document.querySelectorAll('img')].map(img => img.src));
  
  // Send prompt via background script (using debugger API)
  const sendRes = await chrome.runtime.sendMessage({ type: 'SEND_PROMPT', text: prompt });
  if (!sendRes.ok) throw new Error('Failed to send prompt: ' + sendRes.error);
  
  sendStatus('Prompt sent! Waiting for ChatGPT to generate...');
  
  // Wait for image generation
  const img = await waitForGeneratedImage(beforeSources);
  sendStatus('Image generated! Downloading...');
  
  // Fetch image blob
  const imgRes = await fetch(img.src);
  const blob = await imgRes.blob();
  
  sendStatus(`Image downloaded (${Math.round(blob.size / 1024)}KB). Uploading to server...`);
  
  // Upload to server for cropping
  const formData = new FormData();
  formData.append('image', blob, 'icons-grid.png');
  formData.append('metadata', JSON.stringify(metadata));
  
  const uploadRes = await fetch(metadata.generation.api_endpoint, {
    method: 'POST',
    body: formData
  });
  
  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Upload failed: ${uploadRes.status} ${errorText}`);
  }
  
  const result = await uploadRes.json();
  sendStatus(`✅ Server cropped ${result.icons.length} icons successfully!`);
  
  chrome.runtime.sendMessage({ 
    type: 'GENERATION_COMPLETE', 
    icons: result.icons.map(i => i.id) 
  });
}

function isChatGenerating() {
  const text = document.body.innerText;
  return text.includes('Generating') || 
         text.includes('Creating') || 
         text.includes('Drawing') ||
         !!document.querySelector('[data-testid="stop-button"]');
}

async function waitForGeneratedImage(beforeSources, timeoutMs = 360000) {
  const startTime = Date.now();
  let foundLoading = false;
  
  while (Date.now() - startTime < timeoutMs) {
    const loading = isChatGenerating();
    if (loading) foundLoading = true;
    
    if (foundLoading && !loading) {
      // Generation finished, find new image
      const selectors = [
        'img[alt^="Generated image:"]',
        'div[class*="imagegen"] img',
        'div[class*="image-gen"] img'
      ];
      
      for (const sel of selectors) {
        const imgs = [...document.querySelectorAll(sel)].filter(img => {
          if (!img.src || beforeSources.has(img.src)) return false;
          const rect = img.getBoundingClientRect();
          return rect.width >= 120 && rect.height >= 120;
        });
        
        if (imgs.length) {
          return imgs[imgs.length - 1]; // Return latest image
        }
      }
    }
    
    await sleep(1500);
  }
  
  throw new Error('Timeout: Image generation did not complete within 6 minutes');
}
