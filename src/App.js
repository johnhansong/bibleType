import { GlobalStyles } from "./styles/global";
import Header from "./components/Header";
import TypingBox from "./components/TypingBox";
import Footer from "./components/Footer";
import { ThemeProvider } from "styled-components";
import { useTheme } from "./context/themeContext";

function App() {
  const {theme} = useTheme()

  return (
    <ThemeProvider theme={theme}>
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
