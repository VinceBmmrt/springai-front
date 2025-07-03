import { useState } from "react";
import ChatAI from "../src/components/ChatAI";
import "./App.css";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ChatAI />
    </>
  );
}

export default App;
