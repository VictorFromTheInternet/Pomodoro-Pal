// import React from 'react'
import './Pal.css'

interface PomodoroPalProps{
  gifPath: string
}

function PomodoroPal({gifPath}: PomodoroPalProps) {

  return (
    <>
      <img src={chrome.runtime.getURL(gifPath)} className="pomodoro-pal" />
    </>
  )
}

export default PomodoroPal
