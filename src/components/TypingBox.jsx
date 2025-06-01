import React from "react"
import UpperMenu from "./UpperMenuComponent/UpperMenu"
import { useTestMode } from "../context/testModeContext"
import { useBible } from "../context/bibleContext"
import { useRef, useState, useEffect } from "react"
import { generate } from "random-words"
import Stats from "./Stats"

const TypingBox = () => {
  // context
  const {mode, testTime, wordCount} = useTestMode();
  const {verseContent} = useBible();

  const inputRef = useRef(null);
  const typeBoxScrollerRef = useRef(null);
  const [testFocus, setTestFocus] = useState(false);

  //states for initializing test
  const [wordsArray, setWordsArray] = useState(() => generate(50));
  const [intervalId, setIntervalId] = useState(null);
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0);

  //States for testing
  const [testStart, setTestStart] = useState(false);
  const [testEnd, setTestEnd] = useState(false);
  const [countDown, setCountDown] = useState(testTime);
  const [elapsedTime, setElapsedTime] = useState(0);

  //States for checking test performance
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [missedChars, setMissedChars] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [extraChars, setExtraChars] = useState(0);
  const [graphData, setGraphData] = useState([]);

  const wordsSpanRef = useRef([])

  const startTimer = () => {
    let seconds = 0
    const intervalId = setInterval(() => {
      seconds += 1
      setCorrectChars((correctChars) => {
        setGraphData((graphData) => {
          const wpm = (correctChars / 5) / (seconds / 60);
          return [...graphData, [seconds, Math.round(wpm)]]
        });
        return correctChars;
      });
      if (mode === "time") {
        setCountDown((prev) => {
          if (prev === 1) {
            clearInterval(intervalId);
            setTestEnd(true);
            return 0;
          }
          return prev - 1;
        });
      } else if (mode === "words" || mode === "passage") {
        setElapsedTime(seconds);
      }
    }, 1000);
    setIntervalId(intervalId)
  }


    // Modified to use wordsSpanRef.current directly
  const resetWordSpanRefClassname = () => {
    // Ensure wordsSpanRef.current is a non-empty array
    if (wordsSpanRef.current && wordsSpanRef.current.length > 0) {
      wordsSpanRef.current.forEach(wordRef => {
        // Check if the ref has a current value (i.e., it's attached to a DOM element)
        if (wordRef && wordRef.current) {
          Array.from(wordRef.current.childNodes).forEach(ltr => {
            ltr.className = "";
          });
        }
      });
    }

    if (wordsSpanRef.current[0]?.current?.childNodes[0]) {
      wordsSpanRef.current[0].current.childNodes[0].className = 'current';
    }
  }

  useEffect(() => {
    // Clear the current refs array before new ones are assigned in the render
    // wordsSpanRef.current = wordsSpanRef.current.slice(0, wordsArray.length).map((ref, index) => ref || React.createRef());
    // Clear any excess refs if wordsArray becomes smaller
    // wordsSpanRef.current = wordsSpanRef.current.filter((_, index) => index < wordsArray.length);

    // Call resetWordSpanRefClassname after the render cycle where refs are attached
    // A small timeout can sometimes help if React's ref attachment is asynchronous
    // or if the component hasn't fully rendered the new elements.
    const timeoutId = setTimeout(() => {
      resetWordSpanRefClassname();
    }, 0); // Using setTimeout(..., 0) defers execution until after the current render cycle

    return () => clearTimeout(timeoutId);
  }, [wordsArray]);

  const resetTest = () => {
    clearInterval(intervalId);

    let newWords;
    if (mode === "time") {
      setCountDown(testTime);
      newWords = generate(50)
    } else if (mode === "words") {
      newWords = generate(wordCount)
    } else if (mode === "passage") {
      newWords = verseContent || generate(50);
    } else {
      newWords = generate(50)
    }
    setWordsArray(newWords);

    setCorrectChars(0);
    setIncorrectChars(0);
    setMissedChars(0);
    setExtraChars(0);
    setCorrectWords(0);
    setGraphData([]);
    setCurrWordIndex(0);
    setCurrCharIndex(0);
    setElapsedTime(0)
    setTestStart(false);
    setTestEnd(false);

    focusInput();
  }

  useEffect(() => {
    resetTest();
  }, [testTime, mode, wordCount, verseContent])

  const handleUserInput = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length > 1 && e.key !== "Backspace" && e.key !== " ") return;

    const isLetter = /^[a-zA-Z]/.test(e.key)
    const isPunctuation = /^[.,?!;:'"()[\]{}–—…-]$/.test(e.key);
    const isSpace = e.key === " ";

    if (!isLetter && !isPunctuation && !isSpace) {
      e.preventDefault()
    }

    if (testEnd) {
      return;
    }

    if (!testStart) {
      // if test has not started upon initial key press, start timer and test start
      startTimer();
      setTestStart(true);
    }

    const allCurrChars = wordsSpanRef.current[currWordIndex]?.current?.childNodes;

    //keyCode for space_bar is 32
    if(e.keyCode === 32) {
      //space_bar logic

      if (currWordIndex === wordsSpanRef.current.length - 1) {
        setTestEnd(true);
        clearInterval(intervalId);
        return;
      }

      let correctCharsInWord = wordsSpanRef.current[currWordIndex].current.querySelectorAll('.correct')

      if(correctCharsInWord.length === allCurrChars.length) {
        setCorrectWords(correctWords + 1)
      }

      if(allCurrChars.length <= currCharIndex) {
        // End test if last word was typed
        if (currWordIndex + 1 >= wordsSpanRef.current.length) {
          setTestEnd(true);
          clearInterval(intervalId);
          return;
        }

        //remove cursor from last place in prev word
        allCurrChars[currCharIndex-1].classList.remove('current-right')
        wordsSpanRef.current[currWordIndex+1].current.childNodes[0].className = "current";
        setCurrWordIndex(currWordIndex+1)
        setCurrCharIndex(0)
        return;
      } else {
        //if space is pressed in a word
        setMissedChars(missedChars+1)
        allCurrChars[currCharIndex].classList.remove('current')
        allCurrChars[currCharIndex].className = "incorrect";
      }
    }

    if(e.keyCode === 8) {
      //backspace logic
      if (0 < currCharIndex && currCharIndex < allCurrChars.length) {
        setCurrCharIndex((prev) => {
          allCurrChars[prev].className = "";
          allCurrChars[prev-1].className = "current";
          return prev - 1;
        });
      } else if (currCharIndex === allCurrChars.length) {
        // edge case: deleting from end of word
        if(currCharIndex > 0) {
          if (allCurrChars[currCharIndex-1].className.includes('extra')){
            // edge case: deleting extra incorrect letters from end of word
            allCurrChars[currCharIndex-1].remove();
            allCurrChars[currCharIndex-2].className += ' current-right'
            setCurrCharIndex(currCharIndex-1)
            return currCharIndex-1
          } else {
            setCurrCharIndex(currCharIndex-1)
            allCurrChars[currCharIndex-1].className = "current";
            return currCharIndex-1
          }
        }
        return currCharIndex
      } else if (currWordIndex > 0) {
        // edge case: deleting from start of word to previous word
        setCurrWordIndex((prevWordIndex) => {
          allCurrChars[currCharIndex].className = "";
          const backspaceWordIndex = prevWordIndex - 1;

          if (backspaceWordIndex < 0) {
            console.warn("Error: returning early to prevent negative word index")
            return prevWordIndex
          }

          const prevWordRef = wordsSpanRef.current[backspaceWordIndex]?.current;
          if(!prevWordRef) {
            console.warn("Invalid ref access at index:", backspaceWordIndex)
            return prevWordIndex;
          }
          const prevWordCharCount = prevWordRef.childNodes.length;
          // preserving this order is crucial to update currCharIndex before
          // trying to access allCurrChars[currCharIndex]
          // prevents accessing an accidental undefined element when switching words
          setCurrCharIndex(prevWordCharCount);
          prevWordRef.childNodes[prevWordCharCount - 1].classList.add("current-right")

          return prevWordIndex - 1
        });
      }
      return;
    }

    // edge case: if keys are pressed at end of word
    if (currCharIndex === allCurrChars.length) {
      allCurrChars[currCharIndex-1].classList.remove('current-right')
      let newSpan = document.createElement('span');
      newSpan.innerText = e.key;
      newSpan.className = "incorrect extra current-right"
      wordsSpanRef.current[currWordIndex].current.append(newSpan)
      setCurrCharIndex(currCharIndex+1);
      setExtraChars(extraChars+1)
      return;
    }

    //checking if input is correct
    if(e.key === allCurrChars[currCharIndex].innerText) {
      allCurrChars[currCharIndex].className = "correct";
      setCorrectChars(correctChars+1)
    } else {
      allCurrChars[currCharIndex].className = "incorrect";
      setIncorrectChars(incorrectChars+1)
    }

    if(currCharIndex+1 === allCurrChars.length) {
      allCurrChars[currCharIndex].className += " current-right";
    } else {
      allCurrChars[currCharIndex+1].className = "current";
    }

    setCurrCharIndex((prev) => prev+1);
  }

  const calculateWPM = () => {
    const minutes = mode === "time" ? testTime / 60 : elapsedTime / 60;
    return Math.round((correctChars/5)/minutes)
  }

  const calculateAcc = () => {
    return Math.round((correctWords/currWordIndex)*100)
  }

  const focusInput = () => {
    inputRef.current.focus();
  }

  const currentWordRef = wordsSpanRef.current[currWordIndex]?.current;
  const box = typeBoxScrollerRef.current;
  if (currentWordRef && box) {
    const wordTop = currentWordRef.offsetTop;
    const wordBottom = wordTop + currentWordRef.offsetHeight;
    const boxScrollTop = box.scrollTop;
    const boxHeight = box.clientHeight;

    const upperBuffer = 40; // Scroll a bit earlier when approaching the top
    const lowerBuffer = 80; // Scroll a bit earlier when approaching the bottom

    if (wordBottom > boxScrollTop + boxHeight - lowerBuffer) {
      // Scroll down earlier
      box.scrollTop = wordBottom - boxHeight + lowerBuffer;
    } else if (wordTop < boxScrollTop + upperBuffer) {
      // Scroll up earlier
      box.scrollTop = wordTop - upperBuffer;
    }
  }

  useEffect(() => {
    focusInput();
    if (wordsSpanRef.current[0]?.current?.childNodes[0]) {
      wordsSpanRef.current[0].current.childNodes[0].className = "current";
    }
  }, [wordsSpanRef.current.length])

  return (
    <div className="type-body">
      {(testEnd) ? (
      // if test end
      <>
        <UpperMenu payload={countDown}/>
        <Stats
        wpm={calculateWPM()}
        accuracy={calculateAcc()}
        correctChars={correctChars}
        incorrectChars={incorrectChars}
        missedChars={missedChars}
        extraChars={extraChars}
        graphData={graphData}
        />

      </>
      )
      :
      //if test has not ended
      <div>
        <div className="type-box">
          <UpperMenu payload={countDown} onClick={(e) => e.stopPropagation()}/>
          {!testFocus && (
            <div className="overlay" >
              <div className="overlay-text">Click to Focus</div>
            </div>
          )}
          {mode === 'time' && <span className={`counter ${!testFocus ? 'blurred' : ''}`}>{countDown}</span>}
          <div className={`words ${!testFocus ? 'blurred' : ''}`} ref={typeBoxScrollerRef} onClick={focusInput}>
            {
              wordsArray?.map((word, index) => (
                <span className="word" ref={ltr => wordsSpanRef.current[index] = {current: ltr}} key={index}>
                  {word.split('').map(char => (
                    <span>{char}</span>
                  ))}
                </span>
              ))
            }
          </div>
        </div>
      </div>
      }

      <input
        type="text"
        className='hidden-input'
        ref={inputRef}
        onKeyDown={handleUserInput}
        onFocus={() => setTestFocus(true)}
        onBlur={() => setTestFocus(false)}
      />
    </div>
  )
}

export default TypingBox
