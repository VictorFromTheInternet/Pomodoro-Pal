// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {  

  const handleBtnClick = async () =>{
    let [tab] = await chrome.tabs.query({active:true})    

    try{
      // check if the page is a chrome page
      if (!tab || !tab.url || tab.url.includes('chrome://') ){
        console.log('can`t run on chrome start page')
      }
      else{

        // execute script
        chrome.scripting.executeScript({
          target: {tabId: tab.id!},
          func: ()=>{
            alert('Hello from my extension!')

            // anchor gif to the bottom right
            let pomodoroPal = document.createElement('img')
            pomodoroPal.src = chrome.runtime.getURL('Pomodoro_Pal_Typing.gif')

            pomodoroPal.style.height = '100px'
            pomodoroPal.style.width = '100px'
            pomodoroPal.style.position = 'fixed'
            pomodoroPal.style.right = '0'
            pomodoroPal.style.bottom = '0'
            pomodoroPal.style.zIndex = '1001'
                        
            document.body.appendChild(pomodoroPal)
          }
        })
      }
      
    }
    catch(err){
      console.error("An error occured: ", err)
    }
    
  }

  return (
    <>          
      <h1>Pomodoro Pal</h1>
      <div className="card">
        <button onClick={handleBtnClick}>
          Hello World!
        </button>                
      </div>
      
    </>
  )
}

export default App
