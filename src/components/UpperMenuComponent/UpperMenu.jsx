import React from "react";
import { useTestMode } from "../../context/testModeContext";

const UpperMenu = ({payload}) => {
  const {
    mode,
    setMode,

    testTime,
    setTestTime,

    wordCount,
    setWordCount,

    passage,
    setPassage,
  } = useTestMode();

  const updateTime = (e) => {
    setTestTime(Number(e.target.id))
  }


  return (
    <div className='upper-menu'>
      <div className="modes">
      </div>

      <div className="time-modes">
        <div className="time-mode" id={15} onClick={updateTime}>15s</div>
        <div className="time-mode" id={30} onClick={updateTime}>30s</div>
        <div className="time-mode" id={60} onClick={updateTime}>60s</div>
      </div>
    </div>
  )
}


export default UpperMenu
