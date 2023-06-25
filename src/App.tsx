import React from "react";
import "./App.css";
import PCLevel from "./components/PCLevels";
import RewardCreator from "./components/RewardCreator";
import DiceFormulas from "./components/DiceFormulas";

function App() {
  return (
    <div className="App">
      <PCLevel />
      <RewardCreator />
      <DiceFormulas min={2} max={41} dieSizes={[4, 6, 8, 10, 12]} />
    </div>
  );
}

export default App;
