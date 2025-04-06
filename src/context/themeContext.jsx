import { createContext, useContext, useState } from "react"
import { themeOptions } from "../Utils/themeOptions";

const ThemeContext = createContext();

export const ThemeContextProvider = ({children}) => {

  const userTheme = JSON.parse(localStorage.getItem('theme')) || themeOptions[5].value
  const [theme, setTheme] = useState(userTheme)

  const values = {
    theme,
    setTheme
  }

  return(
    <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
