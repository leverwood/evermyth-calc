import "./App-0.2.css";
import PCLevel from "./PCLevels-0.2";
import RewardCreator from "./RewardCreator-0.2";
import DiceFormulas from "./DiceFormulas-0.2";

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
