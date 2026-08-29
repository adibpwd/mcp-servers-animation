const generateBtn = document.getElementById('generate');
const statusEl = document.getElementById('status');
const previewEl = document.getElementById('preview');
const topicSelect = document.getElementById('topicSelect');
const topicInfo = document.getElementById('topicInfo');
const batchContainer = document.getElementById('batchContainer');
const batchSelect = document.getElementById('batchSelect');
const batchInfo = document.getElementById('batchInfo');

let selectedTopicId = null;
let selectedBatchIds = []; // Array untuk multi-select
let topics = [];

function setStatus(text) {
  statusEl.textContent = text;
  console.log('[ContentIconGen]', text);
}

function addStatus(text) {
  statusEl.textContent += '\n' + text;
  statusEl.scrollTop = statusEl.scrollHeight;
}

// Load topics on popup open
document.addEventListener('DOMContentLoaded', async () => {
  await loadTopics();
});

async function loadTopics() {
  try {
    setStatus('Loading available topics...');
    
    const response = await fetch('http://localhost:3300/api/icons/topics');
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    
    const data = await response.json();
    topics = data.topics || [];
    
    if (topics.length === 0) {
      topicSelect.innerHTML = '<option value="">No topics with icons config found</option>';
      setStatus('No topics found. Create icons.json in content folders first.');
      return;
    }
    
    // Populate dropdown
    topicSelect.innerHTML = '<option value="">-- Select a topic --</option>';
    topics.forEach(topic => {
      const option = document.createElement('option');
      option.value = topic.id;
      const batchLabel = topic.isMultiBatch ? ` [${topic.batches.length} batches]` : '';
      option.textContent = `${topic.title} (${topic.iconCount} icons)${batchLabel}`;
      topicSelect.appendChild(option);
    });
    
    topicSelect.disabled = false;
    setStatus(`Found ${topics.length} topic(s) with icons config. Select one to start.`);
    
  } catch (error) {
    setStatus('ERROR: Cannot load topics. Is server running on port 3300?');
    console.error('[loadTopics]', error);
    topicSelect.innerHTML = '<option value="">Error loading topics</option>';
  }
}

// Handle topic selection
topicSelect.addEventListener('change', (e) => {
  selectedTopicId = e.target.value;
  
  if (!selectedTopicId) {
    generateBtn.disabled = true;
    topicInfo.textContent = '';
    batchContainer.style.display = 'none';
    setStatus('Select a topic to start.');
    return;
  }
  
  const topic = topics.find(t => t.id === selectedTopicId);
  if (topic) {
    generateBtn.disabled = false;
    
    if (topic.isMultiBatch && topic.batches && topic.batches.length > 1) {
      batchContainer.style.display = 'block';
      batchSelect.innerHTML = '';
      
      topic.batches.forEach((b, idx) => {
        const opt = document.createElement('option');
        opt.value = b.batchId;
        opt.textContent = `${b.name} (${b.rows}×${b.cols}, ${b.iconCount} icons)`;
        opt.selected = true; // Select all by default
        batchSelect.appendChild(opt);
      });
      
      // Initialize with all batches selected
      selectedBatchIds = topic.batches.map(b => b.batchId);
      topicInfo.textContent = `Multi-batch: ${topic.batches.length} batches | Total: ${topic.iconCount} icons`;
      batchInfo.textContent = `Selected: ${selectedBatchIds.length} batch(es) - Will generate sequentially`;
    } else {
      batchContainer.style.display = 'none';
      selectedBatchIds = ['default'];
      topicInfo.textContent = `Grid: ${topic.rows}×${topic.cols} | Icons: ${topic.iconCount}`;
    }
    
    setStatus(`Ready to generate icons for: ${topic.title}`);
  }
});

// Handle batch selection (multi-select)
batchSelect.addEventListener('change', (e) => {
  selectedBatchIds = Array.from(e.target.selectedOptions).map(opt => opt.value);
  const topic = topics.find(t => t.id === selectedTopicId);
  
  if (selectedBatchIds.length === 0) {
    batchInfo.textContent = 'Please select at least one batch';
    generateBtn.disabled = true;
  } else if (selectedBatchIds.length === topic?.batches?.length) {
    batchInfo.textContent = `All ${selectedBatchIds.length} batches selected - Will generate sequentially`;
    generateBtn.disabled = false;
  } else {
    const totalIcons = topic?.batches
      ?.filter(b => selectedBatchIds.includes(b.batchId))
      ?.reduce((sum, b) => sum + b.iconCount, 0) || 0;
    batchInfo.textContent = `${selectedBatchIds.length} batch(es) selected | ${totalIcons} total icons`;
    generateBtn.disabled = false;
  }
});

generateBtn.addEventListener('click', async () => {
  if (!selectedTopicId) {
    setStatus('ERROR: No topic selected');
    return;
  }
  
  if (selectedBatchIds.length === 0) {
    setStatus('ERROR: No batch selected');
    return;
  }
  
  generateBtn.disabled = true;
  const topic = topics.find(t => t.id === selectedTopicId);
  setStatus(`Starting generation for: ${topic?.title || selectedTopicId}...`);
  
  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error('No active tab found');
    
    // Check if ChatGPT page
    if (!tab.url?.includes('chatgpt.com') && !tab.url?.includes('chat.openai.com')) {
      throw new Error('Please open ChatGPT page first (https://chatgpt.com)');
    }
    
    addStatus('Ensuring content script is injected...');
    
    // Test if content script is alive or inject dynamically if needed
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'PING' });
    } catch (e) {
      addStatus('Injecting content script into ChatGPT tab...');
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      // Give it a brief moment to initialize
      await new Promise(r => setTimeout(r, 300));
    }
    
    addStatus(`Sending request to generate ${selectedBatchIds.length} batch(es)...`);
    
    // Send message to content script with topicId & batchIds array
    const response = await chrome.tabs.sendMessage(tab.id, { 
      type: 'START_GENERATION',
      topicId: selectedTopicId,
      batchIds: selectedBatchIds // Send array instead of single batchId
    });
    
    if (!response || response.error) {
      throw new Error(response?.error || 'No response from content script');
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
  if (msg.type === 'BATCH_COMPLETE') {
    addStatus(`✅ Batch [${msg.batchId}] cropped (${msg.icons.length} icons)`);
  }
  if (msg.type === 'GENERATION_COMPLETE') {
    addStatus('🎉 ALL GENERATION COMPLETED SUCCESSFULLY!');
    addStatus(`Total Icons Saved: ${msg.icons.join(', ')}`);
    generateBtn.disabled = false;
  }
  if (msg.type === 'GENERATION_ERROR') {
    addStatus('❌ Error: ' + msg.error);
    generateBtn.disabled = false;
  }
});
