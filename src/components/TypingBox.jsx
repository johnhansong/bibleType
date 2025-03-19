import React from "react"
import UpperMenu from "./UpperMenu"
import { createRef, useRef, useState, useEffect, useMemo } from "react"
import { generate } from "random-words"

const TypingBox = () => {

  const inputRef = useRef(null);
  const [wordsArray, setWordsArray] = useState(() => generate(50))
  const [countDown, setCountDown] = useState(15)
  const [currWordIndex, setCurrWordIndex] = useState(0)
  const [currCharIndex, setCurrCharIndex] = useState(0)
  // console.log("currWordIdx", currWordIndex)
  // console.log("currCharIndex", currCharIndex)


  const wordsSpanRef = useMemo(() => {
    return Array(wordsArray.length).fill(0).map(i=>createRef(null));
  }, [wordsArray])

  const handleUserInput = (e) => {
    const allCurrChars = wordsSpanRef[currWordIndex].current.childNodes;
    // console.log("allCurrChars", allCurrChars.length)

    //keyCode for space_bar is 32
    if(e.keyCode === 32) {
      //space_bar logic
      if(allCurrChars.length <= currCharIndex) {
        //remove cursor from last place in prev word
        allCurrChars[currCharIndex-1].classList.remove('current-right')
        wordsSpanRef[currWordIndex+1].current.childNodes[0].className = "current";
        setCurrWordIndex(currWordIndex+1)
        setCurrCharIndex(0)
        return;
      } else {
        //if space is pressed in a word
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
      return;
    }

    //checking if input is correct
    if(e.key === allCurrChars[currCharIndex].innerText) {
      allCurrChars[currCharIndex].className = "correct";
    } else {
      allCurrChars[currCharIndex].className = "incorrect";
    }

    if(currCharIndex+1 === allCurrChars.length) {
      allCurrChars[currCharIndex].className += " current-right";
    } else {
      allCurrChars[currCharIndex+1].className = "current";
    }

    setCurrCharIndex((prev) => prev+1);
  }


  const focusInput= () => {
    inputRef.current.focus();
  }

  useEffect(() => {
    focusInput();
    wordsSpanRef[0].current.childNodes[0].className = "current";
  }, [])

  return (
    <div>
      <UpperMenu />
      <div className="type-box" onClick={focusInput}>
        <div className="words">
          {
            wordsArray.map((word, index) => (
              <span className="word" ref={wordsSpanRef[index]}>
                {word.split('').map(char => (
                  <span>{char}</span>
                ))}
              </span>
            ))
          }
        </div>
      </div>
      <input
        type="text"
        className='hidden-input'
        ref={inputRef}
        onKeyDown={handleUserInput}
      />
    </div>
  )
}

export default TypingBox
