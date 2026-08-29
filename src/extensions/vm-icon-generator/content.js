const ICONS_API_BASE = 'http://localhost:3300/api/icons';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function sendStatus(text) {
  chrome.runtime.sendMessage({ type: 'STATUS_UPDATE', text });
  console.log('[ContentIconGen][content]', text);
}

// Listen for START_GENERATION & PING messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'PING') {
    sendResponse({ ok: true });
    return true;
  }

  if (msg.type === 'START_GENERATION') {
    const topicId = msg.topicId;
    const batchIds = msg.batchIds || []; // Array of batch IDs
    
    if (!topicId) {
      sendResponse({ ok: false, error: 'Missing topicId' });
      return true;
    }
    
    if (!batchIds || batchIds.length === 0) {
      sendResponse({ ok: false, error: 'No batches selected' });
      return true;
    }
    
    // Run async generation
    runGeneration(topicId, batchIds)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => {
        sendResponse({ ok: false, error: error.message });
        chrome.runtime.sendMessage({ type: 'GENERATION_ERROR', error: error.message });
      });

    return true; // Keep channel open for async
  }
});

async function runGeneration(topicId, selectedBatchIds = []) {
  sendStatus(`Fetching initial metadata for topic: ${topicId}...`);
  
  // Fetch initial metadata
  const metaRes = await fetch(`${ICONS_API_BASE}/metadata?topicId=${topicId}`);
  if (!metaRes.ok) {
    const errorText = await metaRes.text();
    throw new Error(`Failed to fetch metadata: ${errorText}`);
  }
  const rootMeta = await metaRes.json();
  
  // Use provided batch IDs directly
  let batchesToProcess = selectedBatchIds.length > 0 ? selectedBatchIds : ['default'];
  
  sendStatus(`Target batches to generate: ${batchesToProcess.join(', ')} (${batchesToProcess.length} batch(es))`);
  
  const allSavedIcons = [];
  
  for (let idx = 0; idx < batchesToProcess.length; idx++) {
    const batchId = batchesToProcess[idx];
    sendStatus(`\n--- Processing Batch ${idx + 1}/${batchesToProcess.length}: [${batchId}] ---`);
    
    // Fetch batch-specific metadata
    const batchRes = await fetch(`${ICONS_API_BASE}/metadata?topicId=${topicId}&batchId=${batchId}`);
    if (!batchRes.ok) {
      throw new Error(`Failed to fetch batch metadata for ${batchId}`);
    }
    const batchMeta = await batchRes.json();
    
    const prompt = batchMeta.generation?.prompt;
    if (!prompt) throw new Error(`No prompt found in batch: ${batchId}`);
    
    sendStatus(`Sending prompt for ${batchMeta.icons.length} icons (${batchMeta.generation.rows}×${batchMeta.generation.cols})...`);
    
    // Track existing image sources in DOM
    const beforeSources = new Set([...document.querySelectorAll('img')].map(img => img.src));
    
    // Send prompt via debugger
    const sendRes = await chrome.runtime.sendMessage({ type: 'SEND_PROMPT', text: prompt });
    if (!sendRes.ok) throw new Error('Failed to send prompt: ' + sendRes.error);
    
    sendStatus('Prompt sent! Waiting for ChatGPT to generate image grid...');
    
    // Wait for generated image
    const img = await waitForGeneratedImage(beforeSources);
    sendStatus(`Image generated for batch [${batchId}]! Downloading...`);
    
    // Fetch image blob
    const imgRes = await fetch(img.src);
    const blob = await imgRes.blob();
    
    sendStatus(`Image downloaded (${Math.round(blob.size / 1024)}KB). Uploading to server for cropping...`);
    
    // Upload to server for cropping
    const formData = new FormData();
    formData.append('image', blob, `${topicId}-${batchId}-grid.png`);
    formData.append('metadata', JSON.stringify(batchMeta));
    
    const uploadRes = await fetch(batchMeta.generation.api_endpoint || `${ICONS_API_BASE}/generate`, {
      method: 'POST',
      body: formData
    });
    
    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      throw new Error(`Upload failed: ${uploadRes.status} ${errorText}`);
    }
    
    const result = await uploadRes.json();
    const batchSaved = result.icons.map(i => i.id);
    allSavedIcons.push(...batchSaved);
    
    chrome.runtime.sendMessage({
      type: 'BATCH_COMPLETE',
      batchId,
      icons: batchSaved
    });
    
    sendStatus(`✓ Batch [${batchId}] finished. Saved: ${batchSaved.join(', ')}`);
    
    // If more batches remain, wait briefly before next prompt
    if (idx < batchesToProcess.length - 1) {
      sendStatus('Waiting 5 seconds before next batch prompt...');
      await sleep(5000);
    }
  }
  
  chrome.runtime.sendMessage({ 
    type: 'GENERATION_COMPLETE', 
    icons: allSavedIcons 
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
