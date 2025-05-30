import { GlobalStyles } from "./styles/global";
import { ThemeProvider } from "styled-components";
import { BibleProvider } from "./context/bibleContext";
import { AuthProvider } from "./context/authContext";
import { useTheme } from "./context/themeContext";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css'

import HomePage from "./Pages/HomePage";
import UserPage from "./Pages/UserPage";

function App() {
  const {theme} = useTheme()

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <BibleProvider>
          <ToastContainer />
          <GlobalStyles/>
          <Routes>
            <Route path='/' element={<HomePage />}/>
            <Route path='/user' element={<UserPage />} />
          </Routes>
        </BibleProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
