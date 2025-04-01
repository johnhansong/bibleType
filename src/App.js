import { GlobalStyles } from "./styles/global";
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
        <div>Header</div>
        <TypingBox />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
