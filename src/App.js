import { GlobalStyles } from "./styles/global";
import Header from "./components/Header";
import TypingBox from "./components/TypingBox";
import Footer from "./components/Footer";
import { ThemeProvider } from "styled-components";
import { useTheme } from "./context/themeContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const {theme} = useTheme()

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <div className="canvas">
        <GlobalStyles/>
        <Header />
        <TypingBox />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
