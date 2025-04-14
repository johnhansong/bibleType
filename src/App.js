import { GlobalStyles } from "./styles/global";
import { ThemeProvider } from "styled-components";
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
        <ToastContainer />
        <GlobalStyles/>

        <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/user' element={<UserPage />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
