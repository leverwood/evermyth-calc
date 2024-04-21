import { useState } from "react";
import {
  TotalSumPercentages,
  addMod,
  advantage,
  atLeast,
  diceFormula,
  sumResults,
} from "../util/dice-calcs";
import { printPercent } from "../../util/print";
import styles from "./NewSystem.module.scss";
import {
  getDCEasyOld,
  getDCHardOld,
  getDCMediumOld,
  getTier,
} from "../../util/calcs";
import { getMaxAbility, getPowerLevel } from "../../0.2/util/pc-calcs-0.2";
import { printModifier } from "../../0.2/util/dice-calcs-0.2";
import Simulations from "./Simulations";
import { getDCEasy, getDCHard, getDCMedium } from "../util/enemy-calc";
import { getMaxMod } from "../util/pc-calcs";

export default function Page() {
  const [level, setLevel] = useState(1);
  const [numPCs, setNumPCs] = useState(4);

  return (
    <div>
      <label>Level</label>
      <input
        type="number"
        value={level}
        onChange={(e) => setLevel(parseInt(e.target.value))}
        min={1}
        max={20}
      />
      <br />
      <label>Num PCs</label>
      <input
        type="number"
        value={numPCs}
        onChange={(e) => setNumPCs(parseInt(e.target.value))}
        min={1}
        max={20}
      />
      <br />
      {!level ? null : (
        <>
          <NewSystem level={level} />
          <Simulations />
          <OldSystem level={level} />
          <NewThresholds level={level} />
        </>
      )}
    </div>
  );
}

function NewSystem({ level }: { level: number }) {
  const dcEasy = getDCEasy(getTier(level));
  const dcModerate = getDCMedium(getTier(level));
  const dcHard = getDCHard(getTier(level));
  const maxMod = getMaxMod(level);

  // d20 +max
  const bestAbility = addMod(diceFormula(1, 20, 5), maxMod);
  const bestAbilityTrained = sumResults(bestAbility, diceFormula(1, 4, 5));
  const bestAbilityTrainedAdv = sumResults(
    bestAbilityTrained,
    diceFormula(1, 6, 5)
  );

  // d12 +max
  const kindaGoodAbility = addMod(diceFormula(1, 12, 5), maxMod);
  const kindaGoodAbilityTrained = sumResults(
    kindaGoodAbility,
    diceFormula(1, 4, 5)
  );
  const kindaGoodAbilityTrainedAdv = sumResults(
    kindaGoodAbilityTrained,
    diceFormula(1, 6, 5)
  );

  // d10
  const notGreatAbility = diceFormula(1, 10, 5);
  const notGreatAbilityTrained = sumResults(
    notGreatAbility,
    diceFormula(1, 4, 5)
  );
  const notGreatAbilityTrainedAdv = sumResults(
    notGreatAbilityTrained,
    diceFormula(1, 6, 5)
  );

  // d8
  const worstAbility = diceFormula(1, 8, 5);
  const worstAbilityTrained = sumResults(worstAbility, diceFormula(1, 4, 5));
  const worstAbilityTrainedAdv = sumResults(
    worstAbilityTrained,
    diceFormula(1, 6, 5)
  );

  return (
    <section>
      <p>
        Tier {getTier(level)} | Easy {dcEasy} | Moderate {dcModerate} | Hard{" "}
        {dcHard}
      </p>
      <p>Pools: 3 - {3 + getTier(level)}.</p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Roll</th>
            <th>Easy ({dcEasy})</th>
            <th>Moderate ({dcModerate})</th>
            <th>Hard ({dcHard})</th>
            <th>Easy x 2</th>
            <th>Moderate x 2</th>
            <th>Hard x 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Best ability (1d20 + {maxMod})</td>
            <td>
              <Percent results={bestAbility} dc={dcEasy} />
            </td>
            <td>
              <Percent results={bestAbility} dc={dcModerate} />
            </td>
            <td>
              <Percent results={bestAbility} dc={dcHard} />
            </td>
            <td>
              <Percent
                results={bestAbility}
                dc={dcEasy * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={bestAbility}
                dc={dcModerate * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={bestAbility}
                dc={dcHard * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={bestAbility}
                dc={dcEasy * 3}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={bestAbility}
                dc={dcModerate * 3}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={bestAbility}
                dc={dcHard * 3}
                canAutoWin={false}
              />
            </td>
          </tr>
          <tr>
            <td>Best ability, trained (1d20 + 1d4 + {maxMod})</td>
            <td>
              <Percent results={bestAbilityTrained} dc={dcEasy} />
            </td>
            <td>
              <Percent results={bestAbilityTrained} dc={dcModerate} />
            </td>
            <td>
              <Percent results={bestAbilityTrained} dc={dcHard} />
            </td>
            <td>
              <Percent
                results={bestAbilityTrained}
                dc={dcEasy * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={bestAbilityTrained}
                dc={dcModerate * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={bestAbilityTrained}
                dc={dcHard * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={bestAbilityTrained}
                dc={dcEasy * 3}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={bestAbilityTrained}
                dc={dcModerate * 3}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={bestAbilityTrained}
                dc={dcHard * 3}
                canAutoWin={false}
              />
            </td>
          </tr>
          <tr className={styles.borderBottom}>
            <td>Best ability, trained, adv (1d20 + 1d6 + 1d4 + {maxMod})</td>
            <td>
              <Percent results={bestAbilityTrainedAdv} dc={dcEasy} />
            </td>
            <td>
              <Percent results={bestAbilityTrainedAdv} dc={dcModerate} />
            </td>
            <td>
              <Percent results={bestAbilityTrainedAdv} dc={dcHard} />
            </td>
            <td>
              <Percent
                results={bestAbilityTrainedAdv}
                dc={dcEasy * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={bestAbilityTrainedAdv}
                dc={dcModerate * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={bestAbilityTrainedAdv}
                dc={dcHard * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={bestAbilityTrainedAdv}
                dc={dcEasy * 3}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={bestAbilityTrainedAdv}
                dc={dcModerate * 3}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={bestAbilityTrainedAdv}
                dc={dcHard * 3}
                canAutoWin={false}
              />
            </td>
          </tr>
          <tr>
            <td>Kinda good ability (1d12 + {maxMod})</td>
            <td>
              <Percent results={kindaGoodAbility} dc={dcEasy} />
            </td>
            <td>
              <Percent results={kindaGoodAbility} dc={dcModerate} />
            </td>
            <td>
              <Percent results={kindaGoodAbility} dc={dcHard} />
            </td>
            <td>
              <Percent
                results={kindaGoodAbility}
                dc={dcEasy * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={kindaGoodAbility}
                dc={dcModerate * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={kindaGoodAbility}
                dc={dcHard * 2}
                canAutoWin={false}
              />
            </td>
          </tr>
          <tr>
            <td>Kinda good ability, trained (1d12 + 1d4 + {maxMod})</td>
            <td>
              <Percent results={kindaGoodAbilityTrained} dc={dcEasy} />
            </td>
            <td>
              <Percent results={kindaGoodAbilityTrained} dc={dcModerate} />
            </td>
            <td>
              <Percent results={kindaGoodAbilityTrained} dc={dcHard} />
            </td>
            <td>
              <Percent
                results={kindaGoodAbilityTrained}
                dc={dcEasy * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={kindaGoodAbilityTrained}
                dc={dcModerate * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={kindaGoodAbilityTrained}
                dc={dcHard * 2}
                canAutoWin={false}
              />
            </td>
          </tr>
          <tr className={styles.borderBottom}>
            <td>
              Kinda good ability, trained, adv (1d12 + 1d4 + 1d6 + {maxMod})
            </td>
            <td>
              <Percent results={kindaGoodAbilityTrainedAdv} dc={dcEasy} />
            </td>
            <td>
              <Percent results={kindaGoodAbilityTrainedAdv} dc={dcModerate} />
            </td>
            <td>
              <Percent results={kindaGoodAbilityTrainedAdv} dc={dcHard} />
            </td>
            <td>
              <Percent
                results={kindaGoodAbilityTrainedAdv}
                dc={dcEasy * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={kindaGoodAbilityTrainedAdv}
                dc={dcModerate * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={kindaGoodAbilityTrainedAdv}
                dc={dcHard * 2}
                canAutoWin={false}
              />
            </td>
          </tr>
          <tr>
            <td>Not great ability (1d10)</td>
            <td>
              <Percent results={notGreatAbility} dc={dcEasy} />
            </td>
            <td>
              <Percent results={notGreatAbility} dc={dcModerate} />
            </td>
            <td>
              <Percent results={notGreatAbility} dc={dcHard} />
            </td>
            <td>
              <Percent
                results={notGreatAbility}
                dc={dcEasy * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={notGreatAbility}
                dc={dcModerate * 2}
                canAutoWin={false}
              />
            </td>
            <td>
              <Percent
                results={notGreatAbility}
                dc={dcHard * 2}
                canAutoWin={false}
              />
            </td>
          </tr>
          <tr>
            <td>Not great ability, trained (1d10 + 1d4)</td>
            <td>
              <Percent results={notGreatAbilityTrained} dc={dcEasy} />
            </td>
            <td>
              <Percent results={notGreatAbilityTrained} dc={dcModerate} />
            </td>
            <td>
              <Percent results={notGreatAbilityTrained} dc={dcHard} />
            </td>
          </tr>
          <tr className={styles.borderBottom}>
            <td>Not great ability, trained, adv (1d10 + 1d4 + 1d6)</td>
            <td>
              <Percent results={notGreatAbilityTrainedAdv} dc={dcEasy} />
            </td>
            <td>
              <Percent results={notGreatAbilityTrainedAdv} dc={dcModerate} />
            </td>
            <td>
              <Percent results={notGreatAbilityTrainedAdv} dc={dcHard} />
            </td>
          </tr>
          <tr>
            <td>Worst ability (1d8)</td>
            <td>
              <Percent results={worstAbility} dc={dcEasy} />
            </td>
            <td>
              <Percent results={worstAbility} dc={dcModerate} />
            </td>
            <td>
              <Percent results={worstAbility} dc={dcHard} />
            </td>
          </tr>
          <tr>
            <td>Worst ability, trained (1d8 + 1d4)</td>
            <td>
              <Percent results={worstAbilityTrained} dc={dcEasy} />
            </td>
            <td>
              <Percent results={worstAbilityTrained} dc={dcModerate} />
            </td>
            <td>
              <Percent results={worstAbilityTrained} dc={dcHard} />
            </td>
          </tr>
          <tr>
            <td>Worst ability, trained, adv (1d8 + 1d4 + 1d6)</td>
            <td>
              <Percent results={worstAbilityTrainedAdv} dc={dcEasy} />
            </td>
            <td>
              <Percent results={worstAbilityTrainedAdv} dc={dcModerate} />
            </td>
            <td>
              <Percent results={worstAbilityTrainedAdv} dc={dcHard} />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function OldSystem({ level }: { level: number }) {
  const dcEasy = getDCEasyOld(getTier(level));
  const dcMedium = getDCMediumOld(getTier(level));
  const dcHard = getDCHardOld(getTier(level));

  const bestAbility = addMod(diceFormula(1, 20), getMaxAbility(level));
  const bestAbilityTrained = addMod(diceFormula(1, 20), getPowerLevel(level));
  const bestAbilityTrainedAdv = addMod(
    addMod(advantage(20), getPowerLevel(level)),
    getTier(level)
  );

  const medModifier = Math.floor(getPowerLevel(level) / 2);
  const mediumAbility = addMod(diceFormula(1, 20), medModifier);
  const mediumAbilityTrained = addMod(mediumAbility, getTier(level));
  const mediumAbilityTrainedAdv = addMod(
    addMod(advantage(20), medModifier),
    getTier(level)
  );

  const badAbility = diceFormula(1, 20);
  const badAbilityTrained = addMod(badAbility, getTier(level));
  const badAbilityTrainedAdv = addMod(addMod(advantage(20), 0), getTier(level));

  const worstAbility = addMod(diceFormula(1, 20), -3);
  const worstAbilityTrained = addMod(worstAbility, getTier(level));
  const worstAbilityTrainedAdv = addMod(
    addMod(advantage(20), -3),
    getTier(level)
  );

  return (
    <section>
      <h1>Old System</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Roll</th>
            <th>Easy ({dcEasy})</th>
            <th>Medium ({dcMedium})</th>
            <th>Hard ({dcHard})</th>
          </tr>
        </thead>
        <tbody>
          <PrintRow
            name={`Best Ability (${printModifier(getMaxAbility(level))})`}
            results={bestAbility}
            dcEasy={dcEasy}
            dcMed={dcMedium}
            dcHard={dcHard}
          />
          <PrintRow
            name={`Best Ability, Full Power (${printModifier(
              getPowerLevel(level)
            )})`}
            results={bestAbilityTrained}
            dcEasy={dcEasy}
            dcMed={dcMedium}
            dcHard={dcHard}
          />
          <PrintRow
            name="Best Ability, Full Power, Adv"
            results={bestAbilityTrainedAdv}
            dcEasy={dcEasy}
            dcMed={dcMedium}
            dcHard={dcHard}
          />
          <PrintRow
            name={`Medium Ability (${printModifier(medModifier)})`}
            results={mediumAbility}
            dcEasy={dcEasy}
            dcMed={dcMedium}
            dcHard={dcHard}
          />
          <PrintRow
            name="Medium Ability, Trained"
            results={mediumAbilityTrained}
            dcEasy={dcEasy}
            dcMed={dcMedium}
            dcHard={dcHard}
          />
          <PrintRow
            name="Medium Ability, Trained, Adv"
            results={mediumAbilityTrainedAdv}
            dcEasy={dcEasy}
            dcMed={dcMedium}
            dcHard={dcHard}
          />
          <PrintRow
            name="Bad Ability (+0)"
            results={badAbility}
            dcEasy={dcEasy}
            dcMed={dcMedium}
            dcHard={dcHard}
          />
          <PrintRow
            name="Bad Ability, Trained"
            results={badAbilityTrained}
            dcEasy={dcEasy}
            dcMed={dcMedium}
            dcHard={dcHard}
          />
          <PrintRow
            name="Bad Ability, Trained, Adv"
            results={badAbilityTrainedAdv}
            dcEasy={dcEasy}
            dcMed={dcMedium}
            dcHard={dcHard}
          />
          <PrintRow
            name={`Worst Ability (${printModifier(-3)})`}
            results={worstAbility}
            dcEasy={dcEasy}
            dcMed={dcMedium}
            dcHard={dcHard}
          />
          <PrintRow
            name="Worst Ability, Trained"
            results={worstAbilityTrained}
            dcEasy={dcEasy}
            dcMed={dcMedium}
            dcHard={dcHard}
          />
          <PrintRow
            name="Worst Ability, Trained, Adv"
            results={worstAbilityTrainedAdv}
            dcEasy={dcEasy}
            dcMed={dcMedium}
            dcHard={dcHard}
          />
        </tbody>
      </table>
    </section>
  );
}

function NewThresholds({ level }: { level: number }) {
  // pcs dodge
  // const pcDodge = outputDiceFormula(1, 20, 5);

  // TODO
  const tier = getTier(level);
  const damage = diceFormula(1, 20);

  const threshold1 = 20 / 2;
  const threshold2 = 12 / 2;
  const threshold3 = 10 / 2;
  const threshold4 = 8 / 2;

  // dice size + level
  return (
    <section>
      <h1>Thresholds</h1>
      <p>The enemy deals {tier}d20</p>
      <table>
        <tbody>
          <tr>
            <td>threshold</td>
            <td>likelihood of 1 wound</td>
            <td>likelihood of 2 wounds</td>
          </tr>
          <tr>
            <td>threshold 1: {threshold1}</td>
            <td>
              <Percent results={damage} dc={threshold1} />
            </td>
            <td>
              <Percent results={damage} dc={threshold1 * 2} />
            </td>
          </tr>
          <tr>
            <td>threshold 2: {threshold2}</td>
            <td>
              <Percent results={damage} dc={threshold2} />
            </td>
            <td>
              <Percent results={damage} dc={threshold2 * 2} />
            </td>
          </tr>
          <tr>
            <td>threshold 3: {threshold3}</td>
            <td>
              <Percent results={damage} dc={threshold3} />
            </td>
            <td>
              <Percent results={damage} dc={threshold3 * 2} />
            </td>
          </tr>
          <tr>
            <td>threshold 4: {threshold4}</td>
            <td>
              <Percent results={damage} dc={threshold4} />
            </td>
            <td>
              <Percent results={damage} dc={threshold4 * 2} />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function PrintRow({
  name,
  results,
  dcEasy,
  dcMed,
  dcHard,
}: {
  name: string;
  results: TotalSumPercentages;
  dcEasy: number;
  dcMed: number;
  dcHard: number;
}) {
  return (
    <tr>
      <td>{name}</td>
      <td>
        <Percent results={results} dc={dcEasy} />
      </td>
      <td>
        <Percent results={results} dc={dcMed} />
      </td>
      <td>
        <Percent results={results} dc={dcHard} />
      </td>
    </tr>
  );
}

function Percent({
  results,
  dc,
  canAutoWin = true,
}: {
  results: TotalSumPercentages;
  dc: number;
  canAutoWin?: boolean;
}) {
  return <span>{printPercent(atLeast(results, dc))}</span>;
}

function ResultTable({ sums }: { sums: TotalSumPercentages }) {
  return (
    <table width="100%">
      <thead>
        <tr>
          <th>Total</th>
          <th>Percent</th>
        </tr>
      </thead>
      <tbody>
        {sums.result.map((result) => (
          <tr key={result.total}>
            <td width="50px">{result.total}</td>
            <td>
              {(result.percent * 100).toFixed(2)}%
              <div
                style={{
                  width: `${result.percent * 100}%`,
                  height: "1em",
                  backgroundColor: "#ccc",
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
