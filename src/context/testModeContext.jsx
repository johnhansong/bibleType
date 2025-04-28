import { useContext, createContext, useState, useEffect } from "react";

const TestModeContext = createContext();

export const TestModeContextProvider = ({children}) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("mode") || "time";
  })
  // modes = [time, words, passage]
  const [testTime, setTestTime] = useState(15)
  const [wordCount, setWordCount] = useState(25)
  const [passage, setPassage] = useState({})

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode])

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
