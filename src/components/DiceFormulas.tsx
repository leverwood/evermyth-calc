import React from "react";
import styles from "./DiceFormulas.module.scss";
import {
  findHighestLikely,
  getAllDiceFormulas,
  printDiceFormula,
} from "../util/dice-calcs";

interface DiceFormulasProps {
  min: number;
  max: number;
  dieSizes: number[];
}

export default function DiceFormulas({
  min,
  max,
  dieSizes,
}: DiceFormulasProps) {
  const diceFormulas = getAllDiceFormulas(min, max, dieSizes);
  return (
    <section className={styles.root}>
      <p></p>
      {Object.keys(diceFormulas).map((avg) => (
        <p key={avg}>
          {avg}:{" "}
          {diceFormulas[avg]
            .map(
              (formula) =>
                printDiceFormula(formula) +
                " [max: " +
                findHighestLikely(formula, 0.05) +
                `]`
            )
            .join(", ")}
        </p>
      ))}
    </section>
  );
}
