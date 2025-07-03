import { useState } from "react";
import ChatAI from "../src/components/ChatAI";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ChatAI />
    </>
  );
}

export default App;
