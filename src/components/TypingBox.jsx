import React from "react"
import UpperMenu from "./UpperMenuComponent/UpperMenu"
import { useTestMode } from "../context/testModeContext"
import { createRef, useRef, useState, useEffect, useMemo } from "react"
import { generate } from "random-words"
import Stats from "./Stats"

const TypingBox = () => {
  const inputRef = useRef(null);
  const [testFocus, setTestFocus] = useState(false)

  //states for initializing test
  const [wordsArray, setWordsArray] = useState(() => generate(50));
  const [intervalId, setIntervalId] = useState(null)
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0);

  //States for testing
  const {mode, testTime} = useTestMode();
  const [testStart, setTestStart] = useState(false);
  const [testEnd, setTestEnd] = useState(false);
  const [countDown, setCountDown] = useState(testTime);

  //States for checking test performance
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [missedChars, setMissedChars] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [extraChars, setExtraChars] = useState(0);
  const [graphData, setGraphData] = useState([])

  const wordsSpanRef = useMemo(() => {
    return Array(wordsArray.length).fill(0).map(i=>createRef(null));
  }, [wordsArray]);

  const startTimer = () => {
    const intervalId = setInterval(timer, 1000);
    setIntervalId(intervalId);
    function timer() {
      setCountDown((latestCountDown) => {
        setCorrectChars((correctChars) => {
          setGraphData((graphData) => {
            return [...graphData, [
              testTime-latestCountDown+1,
              (correctChars/5)/(testTime-latestCountDown+1)/60 //WPM Calc
            ]];
          })
          return correctChars;
        })

        if (latestCountDown === 1) {
          setTestEnd(true);
          clearInterval(intervalId);
          return 0;
        }

        return latestCountDown-1
      })
    }
  }

  const resetWordSpanRefClassname = () => {
    wordsSpanRef?.map(word => {
      Array.from(word.current.childNodes).map(ltr => {
        ltr.className = "";
      });
    });
    wordsSpanRef[0].current.childNodes[0].className = 'current'
  }

  const resetTest = () => {
    clearInterval(intervalId);
    setCountDown(testTime);
    setCurrWordIndex(0);
    setCurrCharIndex(0);
    setTestStart(false);
    setTestEnd(false);
    setWordsArray(generate(50));
    resetWordSpanRefClassname();
    focusInput();
  }

  const handleUserInput = (e) => {
    if (testEnd) {
      return;
    }

    if (!testStart) {
      // if test has not started upon initial key press, start timer and test start
      startTimer();
      setTestStart(true);
    }

    const allCurrChars = wordsSpanRef[currWordIndex]?.current?.childNodes;

    //keyCode for space_bar is 32
    if(e.keyCode === 32) {
      //space_bar logic

      let correctCharsInWord = wordsSpanRef[currWordIndex].current.querySelectorAll('.correct')

      if(correctCharsInWord.length === allCurrChars.length) {
        setCorrectWords(correctWords + 1)
      }

      if(allCurrChars.length <= currCharIndex) {
        //remove cursor from last place in prev word
        allCurrChars[currCharIndex-1].classList.remove('current-right')
        wordsSpanRef[currWordIndex+1].current.childNodes[0].className = "current";
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

          const prevWordRef = wordsSpanRef[backspaceWordIndex]?.current;
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
      wordsSpanRef[currWordIndex].current.append(newSpan)
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
    return Math.round((correctChars/5)/(testTime/60))
  }

  const calculateAcc = () => {
    return Math.round((correctWords/currWordIndex)*100)
  }

  const focusInput = () => {
    inputRef.current.focus();
  }

  useEffect(() => {
    resetTest();
  }, [testTime])

  useEffect(() => {
    focusInput();
    wordsSpanRef[0].current.childNodes[0].className = "current";
  }, [])

  return (
    <div className="type-body">
      {(testEnd) ? (
        //if test end
        <Stats
        wpm={calculateWPM()}
        accuracy={calculateAcc()}
        correctChars={correctChars}
        incorrectChars={incorrectChars}
        missedChars={missedChars}
        extraChars={extraChars}
        graphData={graphData}
        />
      )
      :
      //if test has not ended
      <div className="type-box" onClick={focusInput}>
      <UpperMenu payload={countDown}/>
        {!testFocus && (
          <div className="overlay">
            <div className="overlay-text">Click to Focus</div>
          </div>
        )}
        {mode === 'time' && <span className={`counter ${!testFocus ? 'blurred' : ''}`}>{countDown}</span>}
        <div className={`words ${!testFocus ? 'blurred' : ''}`}>
          {
            wordsArray.map((word, index) => (
              <span className="word" ref={wordsSpanRef[index]} key={index}>
                {word.split('').map(char => (
                  <span>{char}</span>
                ))}
              </span>
            ))
          }
        </div>
      </div>}

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
