// Service worker for background timer logic
console.log('Pomodoro Pal service worker loaded!');

let pomodoroState = {
  isRunning: false,
  currentPhase: 'work',
  timeRemaining: 0,
  workDuration: 15 * 60, // 15 minutes in seconds
  breakDuration: 5 * 60, // 5 minutes in seconds
  blocksRemaining: 2,
  totalBlocks: 2,
  currentGif: 'Pomodoro_Pal_Typing.gif'
};

let timerInterval = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Service worker received message:', message);

  switch (message.action) {
    case 'startTimer':
      startTimer(message.config);
      sendResponse({ success: true });
      break;

    case 'stopTimer':
      stopTimer();
      sendResponse({ success: true });
      break;

    case 'getState':
      sendResponse({ state: pomodoroState });
      break;

    default:
      sendResponse({ error: 'Unknown action' });
  }

  return true; // Keep channel open for async response
});

function startTimer(config) {
  console.log('Starting timer with config:', config);

  // Initialize state
  pomodoroState = {
    isRunning: true,
    currentPhase: 'work',
    timeRemaining: config.work * 60,
    workDuration: config.work * 60,
    breakDuration: config.break * 60,
    blocksRemaining: config.blocks,
    totalBlocks: config.blocks,
    currentGif: 'Pomodoro_Pal_Typing.gif'
  };

  // Clear existing timer if any
  if (timerInterval !== null) {
    clearInterval(timerInterval);
  }

  // Show initial GIF on active tab and inject script if needed
  ensureContentScriptAndUpdate();

  // Start countdown
  timerInterval = setInterval(() => {
    decrementTimer();
  }, 1000);
}

// Helper function to ensure content script is loaded before sending message
async function ensureContentScriptAndUpdate() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  
  if (!activeTab?.id || !activeTab.url || activeTab.url.includes('chrome://')) {
    console.log('Cannot inject on this page');
    return;
  }

  try {
    // Try to ping the content script
    await chrome.tabs.sendMessage(activeTab.id, {
      action: 'showPal',
      gifPath: pomodoroState.currentGif
    });
    console.log('Content script already loaded');
  } catch (error) {
    // Content script not loaded, inject it
    console.log('Injecting content script...');
    try {
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ['content.js']
      });
      
      // Wait for script to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Now send the message
      await chrome.tabs.sendMessage(activeTab.id, {
        action: 'showPal',
        gifPath: pomodoroState.currentGif
      });
      console.log('Content script injected and message sent');
    } catch (injectError) {
      console.error('Failed to inject content script:', injectError);
    }
  }
}

function stopTimer() {
  console.log('Stopping timer');

  pomodoroState.isRunning = false;

  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // Clear badge
  chrome.action.setBadgeText({ text: '' });

  // Hide GIF on all tabs
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id && tab.url && !tab.url.includes('chrome://')) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'hidePal'
        }).catch(() => {
          // Ignore errors for tabs without content script
          console.log('Could not hide pal on tab', tab.id);
        });
      }
    });
  });
}

function decrementTimer() {
  if (!pomodoroState.isRunning) return;

  pomodoroState.timeRemaining--;

  // Update badge with remaining time
  updateBadge();

  // Check if current phase is complete
  if (pomodoroState.timeRemaining <= 0) {
    handlePhaseComplete();
  }
}

function handlePhaseComplete() {
  console.log(`${pomodoroState.currentPhase} phase complete!`);

  if (pomodoroState.currentPhase === 'work') {
    // Work phase complete, start break
    pomodoroState.currentPhase = 'break';
    pomodoroState.timeRemaining = pomodoroState.breakDuration;
    pomodoroState.currentGif = 'Pomodoro_Pal_Sleeping.gif';

    // Show notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('Pomodoro_Pal_Sleeping.gif'),
      title: 'Break Time!',
      message: `Take a ${pomodoroState.breakDuration / 60} minute break.`,
      priority: 2
    });

  } else {
    // Break phase complete
    pomodoroState.blocksRemaining--;

    if (pomodoroState.blocksRemaining > 0) {
      // Start next work block
      pomodoroState.currentPhase = 'work';
      pomodoroState.timeRemaining = pomodoroState.workDuration;
      pomodoroState.currentGif = 'Pomodoro_Pal_Typing.gif';

      // Show notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('Pomodoro_Pal_Typing.gif'),
        title: 'Work Time!',
        message: `Block ${pomodoroState.totalBlocks - pomodoroState.blocksRemaining} of ${pomodoroState.totalBlocks}`,
        priority: 2
      });

    } else {
      // All blocks complete!
      chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('Pomodoro_Pal_Sleeping.gif'),
        title: 'Session Complete!',
        message: 'Great job! You completed all your Pomodoro blocks.',
        priority: 2
      });

      stopTimer();
      return;
    }
  }

  // Update content script with new GIF
  updateContentScript();
}

function updateContentScript() {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const activeTab = tabs[0];
    if (activeTab?.id && activeTab.url && !activeTab.url.includes('chrome://')) {
      try {
        // Try to send message first
        await chrome.tabs.sendMessage(activeTab.id, {
          action: 'showPal',
          gifPath: pomodoroState.currentGif
        });
      } catch (error) {
        // If content script not loaded, inject it first
        console.log('Content script not loaded, injecting...', error);
        try {
          await chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ['content.js']
          });
          
          // Wait a bit for script to load, then try again
          setTimeout(async () => {
            try {
              await chrome.tabs.sendMessage(activeTab.id, {
                action: 'showPal',
                gifPath: pomodoroState.currentGif
              });
            } catch (retryError) {
              console.log('Failed to send message after injection:', retryError);
            }
          }, 100);
        } catch (injectError) {
          console.error('Failed to inject content script:', injectError);
        }
      }
    }
  });
}

function updateBadge() {
  const minutes = Math.floor(pomodoroState.timeRemaining / 60);
  const seconds = pomodoroState.timeRemaining % 60;
  const badgeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  chrome.action.setBadgeText({ text: badgeText });
  chrome.action.setBadgeBackgroundColor({ 
    color: pomodoroState.currentPhase === 'work' ? '#FF6B6B' : '#4ECDC4' 
  });
}

// Clear badge when extension loads
chrome.action.setBadgeText({ text: '' });
