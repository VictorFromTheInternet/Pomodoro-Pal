import React from 'react'
import ReactDOM from 'react-dom/client'
import PomodoroPal from './components/PomodoroPal'
import './components/Pal.css'

console.log('Pomodoro Pal content script loaded!')

// Create a container for the component
const container = document.createElement('div')
container.id = 'pomodoro-pal-root'
document.body.appendChild(container)

// Render the component
const root = ReactDOM.createRoot(container)

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Pomodoro Pal received message:', message)
  
  if (message.action === 'showPal') {
    console.log('Showing pal with gif:', message.gifPath)
    root.render(<PomodoroPal gifPath={message.gifPath} />)
    sendResponse({ success: true })
  } else if (message.action === 'hidePal') {
    console.log('Hiding pal')
    root.render(null)
    sendResponse({ success: true })
  }
  
  return true // Keep message channel open for async response
})