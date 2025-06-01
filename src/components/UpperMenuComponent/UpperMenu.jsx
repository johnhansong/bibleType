import React from "react";
import { useTestMode } from "../../context/testModeContext";
import { useTheme } from "../../context/themeContext";
import { useBible } from "../../context/bibleContext";
import bibleData from '../../assets/bibleMetadata.json'
import "./UpperMenu.css"

const UpperMenu = ({payload}) => {
  const { theme } = useTheme();
  const {
    mode,
    setMode,

    testTime,
    setTestTime,
    wordCount,
    setWordCount,
  } = useTestMode();

  const {
    selectedBook, setSelectedBook,
    selectedChapter, setSelectedChapter,
    verseSelection, setVerseSelection,
  } = useBible();


  const updateTime = (e) => {
    setTestTime(Number(e.target.id))
  }

  const updateWords = (e) => {
    setWordCount(Number(e.target.id))
  }

  const handleMode = (newMode) => {
    setMode(newMode)
  }

  //** Handle Passage **//
  //handleBook
  const bibleBooks = Object.entries(bibleData).map(([key, value]) => [key, value.name]);
  const handleBookChange = (e) => {
    const newBook = Number(e.target.value)
    setSelectedBook(newBook)
    setSelectedChapter(1)
    setVerseSelection([])
  }

  //handleChapter
  const bookChapters = selectedBook
    ? Array.from({ length: bibleData[selectedBook]?.chapters?.length }, (_, i) => i + 1)
    : ["Please Select a Book"]
  const handleChapterChange = (e) => {
    const currChapter = Number(e.target.value)
    const numberOfChapters = bibleData[selectedBook]["chapters"].length
    if (currChapter > numberOfChapters) {
      setSelectedChapter(1)
    }
    setSelectedChapter(currChapter)
    setVerseSelection([])
  }

  //handleVerse
  const chapterLength = bibleData[selectedBook]?.chapters?.[selectedChapter-1]?.length;
  const chapterVerses = selectedChapter && selectedBook
    ? Array.from({ length: chapterLength }, (_, i) => i + 1)
    : []

  const handleVerseChange = (e) => {
    const value = Number(e.target.value);

    setVerseSelection(prev => {
      if (prev.length === 0) {
        return [value, chapterVerses.length]
      }
      if (prev.length === 1) {
        const [first] = prev;
        return [Math.min(first, value), Math.max(first, value)];
      }

      return [value];
    });
  };

  const rangeText = () => {
    if (verseSelection.length === 1) return [verseSelection[0], chapterVerses.length];
    if (verseSelection.length === 2) return [verseSelection[0], verseSelection[1]];
    return [];
  }
  const verseRangeLabel = rangeText().join("-")

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
          <div
            className={`time-mode ${testTime === 15 ? " selected_mode" : ""}`}
            id={15}
            onClick={updateTime}
          >15s</div>
          <div
            className={`time-mode ${testTime === 30 ? " selected_mode" : ""}`}
            id={30}
            onClick={updateTime}
          >30s</div>
          <div
            className={`time-mode ${testTime === 60 ? " selected_mode" : ""}`}
            id={60}
            onClick={updateTime}
          >60s</div>
        </div>
      }

      { mode === "words" &&
        <div className="word-modes">
          <div
            className={`word-mode ${wordCount === 10 ? " selected_mode" : ""}`}
            id={10}
            onClick={updateWords}
          >10</div>
          <div
            className={`word-mode ${wordCount === 25 ? " selected_mode" : ""}`}
            id={25}
            onClick={updateWords}
          >25</div>
          <div
            className={`word-mode ${wordCount === 50 ? " selected_mode" : ""}`}
            id={50}
            onClick={updateWords}
          >50</div>
        </div>
      }

      { mode === "passage" &&
      <div className="bible_select_row">
        <select
          name="bible-book"
          id="book-select"
          className="bible-selector"
          onChange={handleBookChange}
          value={selectedBook ? selectedBook : ""}
        >
          <option value="" disabled>--Select Book--</option>
          {bibleBooks.map(book => {
            return (<option value={book[0]} key={book[0]}>
              {book[1]}
            </option>)
          })}
        </select>

        {selectedBook &&
          <select
            name="bible-chapter"
            id="chapter-select"
            className="bible-selector"
            onChange={handleChapterChange}
            value={selectedChapter ? selectedChapter : ""}
          >
            <option value="" disabled>--Select Chapter--</option>
            {bookChapters.map(chapter => {
              return (<option value={chapter} key={chapter}>
                {chapter}
              </option>)
            })}
          </select>
        }

        {selectedBook && selectedChapter &&
          <select
            name="bible-verse"
            id="verse-select"
            className="bible-selector"
            onChange={handleVerseChange}
            value={verseSelection.length === 0 ? "" : "verse-range"}
          >
            <option value="" disabled>--Select Verse(s)--</option>
            {verseSelection.length > 0 && (
              <option value="verse-range" disabled>
                {verseRangeLabel}
              </option>
            )}
            {chapterVerses.map(verse => {
              return (<option value={verse} key={verse}>
                {verse}
              </option>)
            })}
          </select>
        }
      </div>
      }

    </div>
  )
}


export default UpperMenu
