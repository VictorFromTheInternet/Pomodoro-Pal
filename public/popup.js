// Popup script for Pomodoro Pal
console.log('Pomodoro Pal popup loaded!');

let isRunning = false;

// Get DOM elements
const workInput = document.getElementById('work');
const breakInput = document.getElementById('break');
const blocksInput = document.getElementById('blocks');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const palContainer = document.getElementById('palContainer');
const palImage = document.getElementById('palImage');

// Load state from background worker
chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
  if (response?.state) {
    isRunning = response.state.isRunning;
    updateUI();
  }
});

// Start button click handler
startBtn.addEventListener('click', () => {
  const config = {
    work: parseInt(workInput.value) || 15,
    break: parseInt(breakInput.value) || 5,
    blocks: parseInt(blocksInput.value) || 2
  };

  chrome.runtime.sendMessage({
    action: 'startTimer',
    config: config
  }, (response) => {
    if (response?.success) {
      console.log('Timer started successfully');
      isRunning = true;
      updateUI();
    }
  });
});

// Stop button click handler
stopBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({
    action: 'stopTimer'
  }, (response) => {
    if (response?.success) {
      console.log('Timer stopped successfully');
      isRunning = false;
      updateUI();
    }
  });
});

// Update UI based on state
function updateUI() {
  if (isRunning) {
    startBtn.style.display = 'none';
    stopBtn.style.display = 'block';
    workInput.disabled = true;
    breakInput.disabled = true;
    blocksInput.disabled = true;
    
    palContainer.style.display = 'block';
    palImage.src = chrome.runtime.getURL('Pomodoro_Pal_Typing.gif');
  } else {
    startBtn.style.display = 'block';
    stopBtn.style.display = 'none';
    workInput.disabled = false;
    breakInput.disabled = false;
    blocksInput.disabled = false;
    
    palContainer.style.display = 'none';
  }
}
