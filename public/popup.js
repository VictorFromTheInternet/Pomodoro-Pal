// Popup script for Pomodoro Pal
console.log("Pomodoro Pal popup loaded!");


// wait for the dom to load
document.addEventListener('DOMContentLoaded', ()=>{
    let isRunning = false;

        
    // Get DOM elements
    const cardStart = document.getElementById("card-start");
    const cardTimer = document.getElementById("card-timer");
    const workInput = document.getElementById("work");
    const breakInput = document.getElementById("break");
    const blocksInput = document.getElementById("blocks");
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const timerDisplay = document.getElementById("timer")
    const blockNum = document.getElementById("block-num")
    const blockTotal = document.getElementById("block-total")
    const titleWork = document.getElementById("title-work")
    const titleBreak = document.getElementById("title-break")
    // const palContainer = document.getElementById("palContainer");
    // const palImage = document.getElementById("palImage");

    // listen for state updates from background worker
    chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
        if(message.action === 'stateUpdate'){
            updateUIFromState(message.state)
        }
    }) 

    // Load initial state from background worker
    chrome.runtime.sendMessage({ action: "getState" }, (response) => {
        if (response?.state) {            
            updateUIFromState(response.state);
        }
    });

    // Start button click handler
    startBtn.addEventListener("click", () => {
        const config = {
            work: parseInt(workInput.value) || 15,
            break: parseInt(breakInput.value) || 5,
            blocks: parseInt(blocksInput.value) || 2,
        };

        chrome.runtime.sendMessage(
            {
                action: "startTimer",
                config: config,
            },
            (response) => {
                if (response?.success) {
                    console.log("Timer started successfully");                    
                }
            }
        );
    });

    // Stop button click handler
    stopBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage(
            {
                action: "stopTimer",
            },
            (response) => {
            if (response?.success) {
                console.log("Timer stopped successfully");                
            }
            }
        );
    });

    // Update UI based on state
    function updateUIFromState(state) {
        isRunning = state.isRunning


        if (isRunning) {                
            // show timer card, update timer info
            cardStart.style.display = "none"
            cardTimer.style.display = "block"            
            workInput.disabled = true;
            breakInput.disabled = true;
            blocksInput.disabled = true;
            
            if(state.currentPhase == "work"){
                titleWork.style.display = "block"
                titleBreak.style.display = "none"
            }else{
                titleWork.style.display = "none"
                titleBreak.style.display = "block"
            }            


            const minutes = Math.floor(state.timeRemaining / 60)
            const seconds = state.timeRemaining % 60
            timerDisplay.value = `${minutes}:${seconds.toString().padStart(2, '0')}`

            blockNum.innerText = (state.totalBlocks - state.blocksRemaining)+1
            blockTotal.innerText = state.totalBlocks

            // pal is created in content script
            // palContainer.style.display = "block";
            // palImage.src = chrome.runtime.getURL("Pomodoro_Pal_Typing.gif");
        } else {    
            cardStart.style.display = "block"
            cardTimer.style.display = "none"            
            workInput.disabled = false;
            breakInput.disabled = false;
            blocksInput.disabled = false;
            titleWork.style.display = "none"
            titleBreak.style.display = "none"

            // palContainer.style.display = "none";
        }
    }

})
