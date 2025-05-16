import React from "react";
import { useTestMode } from "../../context/testModeContext";
import { useTheme } from "../../context/themeContext";
import { useBible } from "../../context/bibleContext";
import "./UpperMenu.css"

const UpperMenu = ({payload}) => {
  const { theme } = useTheme();
  const {
    mode,
    setMode,

    setTestTime,
    setWordCount,
    setPassage,
  } = useTestMode();

  const {
    selectedBook, setSelectedBook,
    selectedChapter, setSelectedChapter,
    verseStart, setVerseStart,
    verseEnd, setVerseEnd,
    verseContent, setVerseContent,
  } = useBible();


  const updateTime = (e) => {
    setTestTime(Number(e.target.id))
  }

  const updateWords = (e) => {
    setWordCount(e.target.id)
  }

  const handleMode = (newMode) => {
    setMode(newMode)
  }

  return (
    <div className='upper-menu'
      style={{
        backgroundColor: theme.background
      }}
    >
      <div className="modes">
        <div
          className={`mode time_mode ${mode === "time" ? " selected_mode" : ""}`}
          onClick={()=> handleMode("time")}
        >time</div>
        <div
          className={`mode words_mode ${mode === "words" ? " selected_mode" : ""}`}
          onClick={()=> handleMode("words")}
        >words</div>
        <div
          className={`mode passage_mode ${mode === "passage" ? " selected_mode" : ""}`}
          onClick={()=> handleMode("passage")}
        >passage</div>
      </div>

      { mode === "time" &&
        <div className="time-modes">
          <div className="time-mode" id={15} onClick={updateTime}>15s</div>
          <div className="time-mode" id={30} onClick={updateTime}>30s</div>
          <div className="time-mode" id={60} onClick={updateTime}>60s</div>
        </div>
      }

      { mode === "words" &&
        <div className="word-modes">
          <div className="word-mode" id={10} onClick={updateWords}>10</div>
          <div className="word-mode" id={25} onClick={updateWords}>25</div>
          <div className="word-mode" id={50} onClick={updateWords}>50</div>
        </div>
      }

      { mode === "passage" &&
      <div className="bible_select_row">
        <select>
          Book
          <option></option>
        </select>
        <select>

        </select>
      </div>
      }

    </div>
  )
}


export default UpperMenu
