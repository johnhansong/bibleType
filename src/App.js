import { GlobalStyles } from "./styles/global";
import TypingBox from "./components/TypingBox";

function App() {
  return (
    <div className="canvas">
      <GlobalStyles/>
      <div>Header</div>
      <TypingBox />
      <div>Footer</div>
    </div>
  );
}

export default App;
