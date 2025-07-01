import React from "react"
import UpperMenu from "./UpperMenuComponent/UpperMenu"
import { useTestMode } from "../context/testModeContext"
import { useBible } from "../context/bibleContext"
import { useRef, useState, useEffect } from "react"
import { generate } from "random-words"
import Stats from "./Stats"

const TypingBox = () => {
  const {mode, testTime, wordCount} = useTestMode();
  const {verseContent} = useBible();

  const inputRef = useRef(null);
  const typeBoxScrollerRef = useRef(null);
  const [testFocus, setTestFocus] = useState(false);

  const [fullPassageWords, setFullPassageWords] = useState([])
  const [wordsArray, setWordsArray] = useState(() => generate(50));
  const [charClasses, setCharClasses] = useState(() =>
    wordsArray.map(word => word.split("").map(() => ""))
  )
  const [intervalId, setIntervalId] = useState(null);
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0);
  const [passageOffset, setPassageOffset] = useState(0);

  const [testStart, setTestStart] = useState(false);
  const [testEnd, setTestEnd] = useState(false);
  const [countDown, setCountDown] = useState(testTime);
  const [elapsedTime, setElapsedTime] = useState(0);

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

  //   // Modified to use wordsSpanRef.current directly
  // const resetWordSpanRefClassname = () => {
  //   // Ensure wordsSpanRef.current is a non-empty array
  //   if (wordsSpanRef.current && wordsSpanRef.current.length > 0) {
  //     wordsSpanRef.current.forEach(wordRef => {
  //       // Check if the ref has a current value (i.e., it's attached to a DOM element)
  //       if (wordRef && wordRef.current) {
  //         Array.from(wordRef.current.childNodes).forEach(ltr => {
  //           ltr.className = "";
  //         });
  //       }
  //     });
  //   }

  //   if (wordsSpanRef.current[0]?.current?.childNodes[0]) {
  //     wordsSpanRef.current[0].current.childNodes[0].className = 'current';
  //   }
  // }

  const resetCharClasses = () => {
    const newCharClasses = wordsArray.map((word, wordIndex) =>
      word.split("").map((_, charIndex) =>
        wordIndex === 0 && charIndex === 0 ? { class: "current" } : { class: "" }
      )
    );
    setCharClasses(newCharClasses)
  }

  useEffect(() => {
    resetCharClasses();
  }, [wordsArray])

  // useEffect(() => {
  //   // Clear the current refs array before new ones are assigned in the render
  //   wordsSpanRef.current = wordsArray.map((_, index) => wordsSpanRef.current[index] || React.createRef());
  //   // Clear excess refs
  //   wordsSpanRef.current = wordsSpanRef.current.slice(0, wordsArray.length);

  //   // Reset classes after refs are updated
  //   const timeoutId = setTimeout(() => {
  //     resetWordSpanRefClassname();
  //   }, 0);

  //   return () => clearTimeout(timeoutId);
  // }, [wordsArray]);

  const resetTest = () => {
    clearInterval(intervalId);

    let newWords;
    if (mode === "time") {
      setCountDown(testTime);
      newWords = generate(50)
    } else if (mode === "words") {
      newWords = generate(wordCount)
    } else if (mode === "passage") {
      console.log(verseContent)
      const allWords = verseContent
        ? verseContent
          .filter(word => word.match(/^[a-zA-Z.,?!;:'"()[\]{}–—…-]+$/))
        : generate(50);
      setFullPassageWords(allWords);
      newWords = allWords.slice(0, 200);
      setPassageOffset(0)
    } else {
      newWords = generate(50);
      setFullPassageWords([]);
      setPassageOffset(0);
    }
    setWordsArray(newWords);
    // console.log("Generating new words within resetTest")

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
    // console.log("useEffect triggered with dependencies:", { testTime, mode, wordCount, verseContent });
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

    if (testEnd) return;
    if (!testStart) {
      startTimer();
      setTestStart(true);
    }

    const currentWord = wordsArray[currWordIndex]
    const allCurrChars = wordsSpanRef.current[currWordIndex]?.current?.childNodes;

    //space_bar logic (keyCode: 32)
    if(e.keyCode === 32) {
      if (mode === "passage" &&
          currWordIndex + passageOffset === fullPassageWords.length - 1 &&
          currCharIndex >= currentWord.length){
        clearInterval(intervalId);
        setTestEnd(true);
        return;
      }

      const currentClasses = charClasses[currWordIndex] || [];
      const wordCorrect = currentWord
        .split("")
        .every((char, idx) => currentClasses[idx]?.class === "correct")

      if (wordCorrect && currentClasses.length === currentWord.length) {
        setCorrectWords(correctWords + 1);
      }


      setCharClasses(prev => {
        const newClasses = [...prev];
        newClasses[currWordIndex] = newClasses[currWordIndex].map(entry => ({
          ...entry,
          class: entry.class
            .replace(/current-right|current/g, "")
            .trim()
        }));
        if (newClasses[currWordIndex + 1]?.[0]) {
          newClasses[currWordIndex + 1][0] = { class: "current" };
        }
        return newClasses;
      });

      if (currentWord.length <= currCharIndex) {
        let newWordIndex = currWordIndex + 1;
        let newOffset = passageOffset;
        let newWordsArray = wordsArray;

        if (mode === "passage" && newWordIndex >= wordsArray.length - 10) {
          const remainingWords = fullPassageWords.slice(newOffset + wordsArray.length);
          if (remainingWords.length > 0) {
            newWordsArray = [
              ...newWordsArray,
              ...remainingWords.slice(0, 10)
            ].slice(0, 50);
            newOffset += 10;
            newWordIndex -= 10;
            setWordsArray(newWordsArray);
            setPassageOffset(newOffset);

            setCharClasses(prev => [
              ...prev,
              ...remainingWords.slice(0, 10).map(word => word.split("").map(() => ({ class: "" })))
            ].slice(0, newWordsArray.length));
          }
        }

        setCurrWordIndex(newWordIndex);
        setCurrCharIndex(0);
      } else {
        setMissedChars(missedChars + 1);
        setCharClasses(prev => {
          const newClasses = [...prev];
          newClasses[currWordIndex][currCharIndex] = { class: "incorrect" };
          if (newClasses[currWordIndex + 1]?.[0]) {
            newClasses[currWordIndex + 1][0] = { class: "current" };
          }
          return newClasses;
        });

        setCurrWordIndex(currWordIndex + 1);
        setCurrCharIndex(0);
      }
      return;
    }

    //backspace logic
    if (e.keyCode === 8) {
      // case 1: currCharIndex is within a word

      if (0 < currCharIndex && currCharIndex < currentWord.length) {
        setCharClasses(prev => {
          const newClasses = [...prev];
          newClasses[currWordIndex][currCharIndex] = { class: "" };
          newClasses[currWordIndex][currCharIndex - 1] = { class: "current" };
          return newClasses;
        });
        setCurrCharIndex(prev => prev - 1);
      } else if (currCharIndex >= currentWord.length) {
      // case 2: deleting extra characters
        const currentClasses = charClasses[currWordIndex];
        const lastIndex = currentClasses.length - 1;

        if (currentClasses[lastIndex]?.class?.includes("extra")) {
          setCharClasses(prev => {
            const newClasses = [...prev];
            newClasses[currWordIndex] = newClasses[currWordIndex].slice(0, lastIndex);
            if (lastIndex > 0) {
              newClasses[currWordIndex][lastIndex - 1] = {
                ...newClasses[currWordIndex][lastIndex - 1],
                class: (newClasses[currWordIndex][lastIndex - 1].class || "")
                  .replace("current-right", "") + " current-right"
              };
            }
            return newClasses;
          });
          setCurrCharIndex(prev => prev - 1);
          setExtraChars(prev => Math.max(0, prev - 1));
          return;
        } else if (
        // case 3: deleting from end of word
          currCharIndex === currentWord.length &&
          charClasses[currWordIndex][currCharIndex - 1]?.class?.includes("current-right")
        ) {
          setCharClasses(prev => {
            const newClasses = [...prev];
            newClasses[currWordIndex][currCharIndex - 1] = {
              class: "current"
            };
            return newClasses;
          });

          setCurrCharIndex(prev => prev - 1);
          return;
        }
      } else if (currWordIndex > 0) {
        setCharClasses(prev => {
          const newClasses = [...prev];
          newClasses[currWordIndex][currCharIndex] = { class: "" };
          const prevWordIdx = currWordIndex - 1;
          const prevWordLen = wordsArray[prevWordIdx].length;
          newClasses[prevWordIdx][prevWordLen - 1] = { class: "current-right" };
          return newClasses;
        });
        setCurrWordIndex(prev => prev - 1);
        setCurrCharIndex(wordsArray[currWordIndex - 1].length);
      }
      return;
    }

    // edge case: if extra typo keys are entered at end of word
    if (currCharIndex >= currentWord.length) {
      setCharClasses(prev => {
        const newClasses = [...prev];
        const currentClasses = [...newClasses[currWordIndex]];
        // If there are already extra characters, remove "current-right" from the last one
        const lastIndex = currentClasses.length - 1;
        if (lastIndex >= currentWord.length - 1) {
          currentClasses[lastIndex] = {
            ...currentClasses[lastIndex],
            class: currentClasses[lastIndex].class.replace("current-right", "").trim()
          };
        }

        currentClasses.push({
          class: "incorrect extra current-right",
          char: e.key
        })

        newClasses[currWordIndex] = currentClasses;
        return newClasses;
      });

      setCurrCharIndex(prev => prev + 1);
      setExtraChars(prev => prev + 1);
      return;
    }

    //checking if input is correct
    setCharClasses(prev => {
      const newClasses = [...prev];
      newClasses[currWordIndex][currCharIndex] =
        {class: e.key === currentWord[currCharIndex] ? "correct" : "incorrect"};

        const isCorrect = e.key === currentWord[currCharIndex];
      newClasses[currWordIndex][currCharIndex] = {
        class: isCorrect ? "correct" : "incorrect"
      };

      // Move cursor forward if there's a next char
      if (currCharIndex + 1 < currentWord.length) {
        newClasses[currWordIndex][currCharIndex + 1] = { class: "current" };
      } else {
        // Last character of word: assign current-right to it
        newClasses[currWordIndex][currCharIndex] = {
          ...newClasses[currWordIndex][currCharIndex],
          class: (newClasses[currWordIndex][currCharIndex].class || "") + " current-right"
        };
      }
      return newClasses;
    });

    if (e.key === currentWord[currCharIndex]) {
      setCorrectChars(correctChars + 1);
    } else {
      setIncorrectChars(incorrectChars + 1);
    }

    setCurrCharIndex(prev => prev + 1);

    if (currWordIndex === wordsArray.length - 1 &&
      currCharIndex + 1 === wordsArray[wordsArray.length-1].length
    ) {
      clearInterval(intervalId);
      setTestEnd(true);
    }

    // Debug: Log state and DOM
    console.log("Char Classes State:", charClasses[currWordIndex]);
    if (allCurrChars) {
      console.log("DOM Classes:", Array.from(allCurrChars).map((char, i) => ({
        index: i,
        text: char.innerText,
        class: char.className
      })));
    }
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

  useEffect(() => {
    focusInput();
  }, [])

  // Auto-scroll logic
  useEffect(() => {
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
        box.scrollTop = wordBottom - boxHeight + lowerBuffer;
      } else if (wordTop < boxScrollTop + upperBuffer) {
        box.scrollTop = wordTop - upperBuffer;
      }
    }
  },[currWordIndex])

  // useEffect(() => {
  //   // console.log("focusInput useEffect called")
  //   focusInput();
  //   if (wordsSpanRef.current[0]?.current?.childNodes[0]) {
  //     wordsSpanRef.current[0].current.childNodes[0].className = "current";
  //   }
  // }, [wordsSpanRef.current.length])

  //debugger
  // console.log("currCharIndex: ", currCharIndex)
  // console.log("currWordIndex: ", currWordIndex)
  // console.log("wordsArray: ", wordsArray)

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
            <div className="overlay">
              <div className="overlay-text">Click to Focus</div>
            </div>
          )}
          {mode === 'time' && <span className={`counter ${!testFocus ? 'blurred' : ''}`}>{countDown}</span>}
          <div className={`words ${!testFocus ? 'blurred' : ''}`} ref={typeBoxScrollerRef} onClick={focusInput}>
            {wordsArray?.map((word, wordIndex) => (
                <span
                  className="word"
                  ref={ltr => wordsSpanRef.current[wordIndex] = {current: ltr}}
                  key={wordIndex}
                >
                  {word.split('').map((char, charIndex) => (
                    <span className={charClasses[wordIndex]?.[charIndex]?.class || ""} key={charIndex}>
                      {char}
                    </span>
                  ))}
                  {(charClasses[wordIndex]?.length || 0) > word.length &&
                    charClasses[wordIndex]
                      .slice(word.length)
                      .map((entry, extraIdx) => (
                        <span className={entry.class} key={`extra=${extraIdx}`}>
                          {entry.char || ""}
                        </span>
                    ))}
                </span>
              ))}
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
