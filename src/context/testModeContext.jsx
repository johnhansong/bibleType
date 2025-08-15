import { useContext, createContext, useState, useEffect } from "react";

const TestModeContext = createContext();

export const TestModeContextProvider = ({children}) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("mode") || "time";
  })
  // modes = [time, words, passage]
  const [testTime, setTestTime] = useState(
    () => Number(localStorage.getItem("testMode.testTime")) || 15)
  const [wordCount, setWordCount] = useState(
    () => Number(localStorage.getItem("testMode.wordCount")) || 25)

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

  const value = {
    mode,
    setMode,

    testTime,
    setTestTime,

    wordCount,
    setWordCount,
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
