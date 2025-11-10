import { useState } from 'react'
import './App.css'
import PomodoroPal from './components/PomodoroPal.tsx'

function App() {  
  const [form, setForm] = useState({
    work: 15,
    break: 5,
    blocks: 2
  });

  const [showPal, setShowPal] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const handleStartClick = async () => {
    try {
      // Send configuration to service worker
      chrome.runtime.sendMessage({
        action: 'startTimer',
        config: {
          work: form.work,
          break: form.break,
          blocks: form.blocks
        }
      }, (response: any) => {
        if (response?.success) {
          console.log('Timer started successfully');
          setIsRunning(true);
          setShowPal(true);
        }
      });
    } catch (err) {
      console.error("An error occurred: ", err);
    }
  }

  const handleStopClick = async () => {
    try {
      chrome.runtime.sendMessage({
        action: 'stopTimer'
      }, (response: any) => {
        if (response?.success) {
          console.log('Timer stopped successfully');
          setIsRunning(false);
          setShowPal(false);
        }
      });
    } catch (err) {
      console.error("An error occurred: ", err);
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

        {!isRunning ? (
          <button onClick={handleStartClick}>
            START
          </button>
        ) : (
          <button onClick={handleStopClick} className="stop-button">
            STOP
          </button>
        )}
      </div>
      
      {showPal && <PomodoroPal gifPath="Pomodoro_Pal_Typing.gif" />}
    </>
  )
}

export default App
