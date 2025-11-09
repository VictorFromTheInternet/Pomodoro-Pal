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

            document.body.style.backgroundColor = 'red'
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
