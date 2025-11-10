import { useState } from 'react'
import './App.css'
import PomodoroPal from './components/PomodoroPal.tsx'

function App() {  
  const [form, setForm] = useState({
    work: 15,
    break: 5,
    blocks: 2,
    workTime: true
  });

  const [showPal, setShowPal] = useState(false)
  const [currentGif, setCurrentGif] = useState('Pomodoro_Pal_Typing.gif')    

  // const decrementTimer = async()=>{

  // }


  const handleBtnClick = async () =>{
    let [tab] = await chrome.tabs.query({active:true})    

    try{
      // check if the page is a chrome page
      if (!tab || !tab.url || tab.url.includes('chrome://') ){
        console.log('can`t run on chrome start page')
        return
      }


      // send message to content script
      if(tab.id){        

        // execute content script
        chrome.tabs.sendMessage(tab.id, {
          action: 'showPal',
          gifPath: currentGif
        })

        // update local state
        setShowPal(true)
        setCurrentGif('Pomodoro_Pal_Typing.gif')
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

        <div className="form-group">
          <label htmlFor="work">Work:</label>
          <input type="number" name="work" id="work"  
                  value={form.work} 
                  onChange={(e)=>{setForm({
                    ...form,
                    work: Number(e.target.value)
                  })}} />
        </div>

        <div className="form-group">
          <label htmlFor="break">Break:</label>
          <input type="number" name="break" id="break" 
                  value={form.break} 
                  onChange={(e)=>{setForm({
                    ...form,
                    break: Number(e.target.value)
                  })}} />
        </div>

        <div className="form-group">
          <label htmlFor="blocks">Blocks:</label>
          <input type="number" name="blocks" id="blocks" 
                  value={form.blocks} 
                  onChange={(e)=>{setForm({
                    ...form,
                    blocks: Number(e.target.value)
                  })}} />
        </div>

        <button onClick={handleBtnClick}>
          START
        </button>                
      </div>
      
      {showPal && <PomodoroPal gifPath={currentGif} />}
    </>
  )
}

export default App
