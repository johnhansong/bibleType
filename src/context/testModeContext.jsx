import { useContext, createContext, useState, useEffect } from "react";

const TestModeContext = createContext();

export const TestModeContextProvider = ({children}) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("mode") || "time";
  })
  // modes = [time, words, passage]
  const [testTime, setTestTime] = useState(() => Number(localStorage.getItem("testMode.testTime")) || 15)
  const [wordCount, setWordCount] = useState(() => Number(localStorage.getItem("testMode.wordCount")) || 25)
  const [passage, setPassage] = useState(() => {
    const stored = localStorage.getItem("testMode.passage");
    try {
      return stored ? JSON.parse(stored) : {Book: "Ephesians", Chapter: 2, Verse: 4}
    } catch (e) {
      console.warn("Corrupted passage data in localStorage. Reverting to default.")
      localStorage.removeItem("testMode.passage");
      return {Book: "Ephesians", Chapter: 2, Verse: 4}
    }
  });

  // Save Mode
  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode])

  // Save test time
  useEffect(() => {
    localStorage.setItem("testMode.testTime", testTime)
  }, [testTime])

  // save word count
  useEffect(() => {
    localStorage.setItem("testMode.wordCount", wordCount)
  }, [wordCount])

  // save passage
  useEffect(() => {
    localStorage.setItem("testMode.passage", JSON.stringify(passage))
  }, [passage])

  const value = {
    mode,
    setMode,

    testTime,
    setTestTime,

    wordCount,
    setWordCount,

    passage,
    setPassage,
  }

  return (
    <TestModeContext.Provider value={value}>
      {children}
    </TestModeContext.Provider>
  )
}

export const useTestMode = () => {
  const context = useContext(TestModeContext);
  if (!context) {
    throw new Error("useTestMode must be used within a TestModeContextProvider")
  }
  return context;
}
