import { useCallback, useEffect, useState } from "react";
import { SimulationData } from "../types/system-types";
import { analyzeSimulations, runSimulations } from "../util/simulate";
import { printPercent } from "../../util/print";
import { getTotalEnemyTiers } from "../util/enemy-calc";
import { getTotalPCTiers } from "../util/pc-calcs";
import { Aftermath, CreaturesDisplay, Rounds, SimulationResults } from "./Simulation";
import { getRandomNum } from "../../util/math";
// import { LOG_LEVEL, Logger } from "../util/log";

const NUM_SIMULATIONS = 1000;
const MIN_LEVEL = 1;
const MAX_LEVEL = 20;
// const logger = Logger(LOG_LEVEL.INFO);

export default function Simulations() {
  const [advToHit, setAdvToHit] = useState(false);
  const [advToDefend, setAdvToDefend] = useState(false);
  const [trainedToHit, setTrainedToHit] = useState(true);
  const [trainedToDefend, setTrainedToDefend] = useState(true);
  const [advToHeal, setAdvToHeal] = useState(false);
  const [trainedToHeal, setTrainedToHeal] = useState(true);
  const [pcsWillFlee, setPCsWillFlee] = useState(true);
  const [doInteraction, setDoInteraction] = useState(true);
  const [showResults, setShowResults] = useState<"tpk" | "longest" | "shortest" | "fled">("tpk");
  const [simulations, setSimulations] = useState<SimulationData[]>([]);

  useEffect(() => {
    const results = runSimulations(NUM_SIMULATIONS, 
      MIN_LEVEL, MAX_LEVEL,
      {
      advToHit,
      advToDefend,
      trainedToHit,
      trainedToDefend,
      advToHeal,
      trainedToHeal,
      pcsWillFlee,
      doInteraction,
    });
    setSimulations(results);
  }, [advToDefend, advToHeal, advToHit, doInteraction, pcsWillFlee, trainedToDefend, trainedToHeal, trainedToHit]);

  const rerunSimulations = useCallback(() => {
    const results = runSimulations(NUM_SIMULATIONS, 
      MIN_LEVEL, MAX_LEVEL,
      {
      advToHit,
      advToDefend,
      trainedToHit,
      trainedToDefend,
      advToHeal,
      trainedToHeal,
      pcsWillFlee,
      doInteraction,
    });
    setSimulations(results);
  }, [advToDefend, advToHeal, advToHit, doInteraction, pcsWillFlee, trainedToDefend, trainedToHeal, trainedToHit]);
  return (
    <section>
      <h1>
        Simulations <button onClick={rerunSimulations}>run</button>
      </h1>
      <label htmlFor="adv-to-hit">Hit Advantage: </label>
      <input
        id="adv-to-hit"
        type="checkbox"
        checked={advToHit}
        onChange={(e) => setAdvToHit(e.target.checked)}
        min={1}
        max={20}
      />
      <label htmlFor="trained-to-hit"> Trained: </label>
      <input
        id="trained-to-hit"
        type="checkbox"
        checked={trainedToHit}
        onChange={(e) => setTrainedToHit(e.target.checked)}
        min={1}
        max={20}
      />
      <br />
      <label htmlFor="adv-to-defend">Defend Advantage: </label>
      <input
        id="adv-to-defend"
        type="checkbox"
        checked={advToDefend}
        onChange={(e) => setAdvToDefend(e.target.checked)}
        min={1}
        max={20}
      />
      <label htmlFor="trained-to-defend"> Trained:</label>
      <input
        id="trained-to-defend"
        type="checkbox"
        checked={trainedToDefend}
        onChange={(e) => setTrainedToDefend(e.target.checked)}
        min={1}
        max={20}
      />
      <br />
      <label htmlFor="adv-to-heal">Advantage to Heal</label>
      <input
        id="adv-to-heal"
        type="checkbox"
        checked={advToHeal}
        onChange={(e) => setAdvToHeal(e.target.checked)}
        min={1}
        max={20}
      />
      <label htmlFor="trained-to-heal"> Trained:</label>
      <input
        id="trained-to-heal"
        type="checkbox"
        checked={trainedToHeal}
        onChange={(e) => setTrainedToHeal(e.target.checked)}
        min={1}
        max={20}
      />
      <br />
      <label htmlFor="do-interaction">PCs Interact (help other PCs)</label>
      <input
        id="do-interaction"
        type="checkbox"
        checked={doInteraction}
        onChange={(e) => setDoInteraction(e.target.checked)}
        min={1}
        max={20}
      />
      <br />
      <label>PCs will flee</label>
      <input
        type="checkbox"
        checked={pcsWillFlee}
        onChange={(e) => setPCsWillFlee(e.target.checked)}
        min={1}
        max={20}
      />{" "}
      (half of them are dead, and everyone left has half damage. It takes 1
      turns to flee. Once someone starts, everyone runs)
      <p>SHOW:</p>
      <input
        id="show-tpk"
        type="radio"
        name="show"
        value="tpk"
        checked={showResults === "tpk"}
        onChange={() => setShowResults("tpk")}
      />
      <label htmlFor="show-tpk">TPKs</label>
      <input
        id="show-longest"
        type="radio"
        name="show"
        value="longest"
        checked={showResults === "longest"}
        onChange={() => setShowResults("longest")}
      />
      <label htmlFor="show-longest">Longest</label>
      <input
        id="show-shortest"
        type="radio"
        name="show"
        value="shortest"
        checked={showResults === "shortest"}
        onChange={() => setShowResults("shortest")}
      />
      <label htmlFor="show-shortest">Shortest</label>
      <input
        id="show-fled"
        type="radio"
        name="show"
        value="fled"
        checked={showResults === "fled"}
        onChange={() => setShowResults("fled")}
      />
      <label htmlFor="show-fled">Fled</label>
      <Analysis simulations={simulations} showResults={showResults} />
    </section>
  );
}

function Analysis({ simulations, showResults }: { simulations: SimulationData[], showResults: "tpk" | "longest" | "shortest" | "fled"}) {
  const [analysis, setAnalysis] = useState(analyzeSimulations(simulations));

  useEffect(() => {
    setAnalysis(analyzeSimulations(simulations));
  }, [simulations]);

  
  if (!analysis) return null;

  const tpkLevels = analysis.tpks.map((sim) => sim.averagePlayerLevel);
  const avgTpkLevel = Math.round(tpkLevels.reduce((acc, level) => acc + level, 0) / tpkLevels.length);

  return (
    <section>
      <p>
        Ran {simulations.length} simulations from level {MIN_LEVEL} to{" "}
        {MAX_LEVEL}.
      </p>
      <ul>
        <li>
          TPKs: {analysis.tpks.length} (
          {printPercent(analysis.tpks.length / simulations.length)}): at levels{" "}
          {analysis.tpks.map((sim) => sim.averagePlayerLevel).join(", ")}{" "}
          (average level: {avgTpkLevel})
        </li>
        <li>
          PCs died: {analysis.pcsDied} (
          {printPercent(analysis.pcsDied / simulations.length)})
        </li>
        <li>
          PCs fled: {analysis.fleeingSims.length} (
          {printPercent(analysis.fleeingSims.length / simulations.length)})
        </li>
        <li>Number of simulations with one round: {analysis.oneRound}</li>
        <li>
          Average times downed: {analysis.averageDowned} | If won:{" "}
          {analysis.averageDownedIfAlive}
        </li>
        <li>
          Average hit chance: {printPercent(analysis.averageHitChance)} |
          double: {printPercent(analysis.averageHitDoubleChance)} | triple:{" "}
          {printPercent(analysis.averageHitTripleChance)}
        </li>
        <li>
          Average dodge chance: any{" "}
          {printPercent(
            analysis.averageDodgeChance + analysis.averageDodgeHalfChance
          )}{" "}
          | full {printPercent(analysis.averageDodgeChance)} | half{" "}
          {printPercent(analysis.averageDodgeHalfChance)}
        </li>
        <li>
          Average number of rounds: {analysis.averageRounds} | Longest:{" "}
          {analysis.longestRounds} ({analysis.longestSims.length} times) |
          Shortest: {analysis.shortestRounds} ({analysis.shortestSims.length}{" "}
          times)
        </li>
      </ul>
      {showResults === "tpk" && analysis.lowestLevelTPK && (
        <Simulation simulation={analysis.lowestLevelTPK} />
      )}
      {showResults === "longest" && (
        <Simulation
          simulation={
            analysis.longestSims[
              getRandomNum(0, analysis.longestSims.length - 1)
            ]
          }
        />
      )}
      {showResults === "shortest" && (
        <Simulation
          simulation={
            analysis.shortestSims[
              getRandomNum(0, analysis.shortestSims.length - 1)
            ]
          }
        />
      )}
      {showResults === "fled" && (
        <Simulation
          simulation={
            analysis.fleeingSims[
              getRandomNum(0, analysis.fleeingSims.length - 1)
            ]
          }
        />
      )}
    </section>
  );

}

function Simulation({ simulation }: { simulation: SimulationData }) {
  return (
    <div>
      <p>
        Assumptions: PCs will immediately try to heal downed pcs. Each
        pc has 1 healing potion, which automatically succeeds and is
        consumed. PCs attack enemies at random, and enemies do the same.
        TODO: No AoE attacks
      </p>
      {simulation.pcsAlive.length === 0 && <h2>TPK</h2>}
      <p>
        Total pc tiers: {getTotalPCTiers(simulation.creatures.pcs)} |
        Total enemy tiers: {getTotalEnemyTiers(simulation.creatures.GM.enemies)}
      </p>
      <SimulationResults simulation={simulation} />
      <CreaturesDisplay creatures={simulation.snapshot} />
      <Rounds rounds={simulation.rounds} creatures={simulation.creatures} />
      <Aftermath simulation={simulation} />
    </div>
  );
}

