// Content script for Pomodoro Pal
console.log("Pomodoro Pal content script loaded!");

// Create container for the pal
let palContainer = null;
let palImage = null;

// Listen for messages from background worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Content script received message:", message);

    if (message.action === "showPal") {
        showPal(message.gifPath);
        sendResponse({ success: true });
    } else if (message.action === "hidePal") {
        hidePal();
        sendResponse({ success: true });
    }

    return true; // Keep channel open for async response
});

function showPal(gifPath) {
    console.log("Showing pal with gif:", gifPath);

    // Create container if it doesn't exist
    if (!palContainer) {
        palContainer = document.createElement("div");
        palContainer.id = "pomodoro-pal-container";
        palContainer.style.cssText = `
            position: fixed;
            bottom: 0px;
            right: 0px;
            z-index: 999999;
            background: rgba(0, 0, 0, 0.25);
            padding: 0px;
            border-radius: 4px 0 0 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            `;

        palImage = document.createElement("img");
        palImage.className = "pomodoroPal";
        palImage.style.cssText = `
            width: 100px;
            height: 100px;
            display: block;
            border-radius: 8px;
            `;

        palContainer.appendChild(palImage);
        document.body.appendChild(palContainer);
    }

    // Update the image source
    palImage.src = chrome.runtime.getURL(gifPath);
    palContainer.style.display = "block";
}

function hidePal() {
    console.log("Hiding pal");
    if (palContainer) {
        palContainer.style.display = "none";
    }
}
