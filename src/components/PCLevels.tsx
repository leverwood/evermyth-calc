import React, { useState } from "react";
import styles from "./PCLevels.module.scss";
import {
  getMaxAbilty,
  getMaxPool,
  getMinPool,
  getPowerLevel,
  getTier,
  totalWellspring,
} from "../util/calcs";
import { ABILITY_MIN_LVL } from "../util/constants";
import {
  chanceToGetHit,
  chanceToHitEnemy,
  getAgainstDC,
  getEncounterTiers,
  getEnemies,
  maxEnemyPools,
  maxRoundsToLose,
} from "../util/enemyCalcs";

interface PCLevelProps {
  lvl: number;
  columns: Column[];
  i: number;
  players: number;
}

enum Column {
  Level = "Level",
  Tier = "Tier",
  MinAbility = "MinAbility",
  MaxAbility = "MaxAbility",
  PowerLevel = "PowerLevel",
  MaxPool = "MaxPool",
  MinPool = "MinPool",
  MaxEnemyPools = "MaxEnemyPools",
  Enemies = "Enemies",
  EncounterTiers = "EncounterTiers",
  EnemyAgainstDC = "EnemyAgainstDC",
  ChanceToMissEnemy = "ChanceToMissEnemy",
  ChanceToHitEnemy = "ChanceToHitEnemy",
  ChanceToGetHit = "ChanceToGetHit",
  MaxRoundsToTPK = "MaxRoundsToTPK",
  Wellspring = "Wellspring",
}

const labels: { [K in keyof typeof Column]: string } = {
  Level: "Level",
  Tier: "Tier",
  MinAbility: "Min Ability",
  MaxAbility: "Max Ability",
  PowerLevel: "Power Level",
  MaxPool: "Max Pool",
  MinPool: "Min Pool",
  MaxEnemyPools: "Max Enemy Pools",
  EncounterTiers: "Encounter Tiers",
  Enemies: "Enemies",
  EnemyAgainstDC: "Enemy Against DC",
  ChanceToMissEnemy: "Chance To Miss Enemy, Best Modifier",
  ChanceToHitEnemy: "Chance To Hit Enemy, Best Modifier",
  ChanceToGetHit: "Chance To Get Hit, Best Modifier",
  MaxRoundsToTPK: "Max Rounds To TPK",
  Wellspring: "Wellspring",
};

function PCLevel({ lvl, columns, i, players }: PCLevelProps) {
  const vals: {
    readonly [K in keyof typeof Column]: number | string;
  } = {
    Level: "lvl " + lvl,
    Tier: "T" + getTier(lvl),
    MinAbility: ABILITY_MIN_LVL,
    MaxAbility: "+" + getMaxAbilty(lvl),
    PowerLevel: "+" + getPowerLevel(lvl),
    MaxPool: getMaxPool(lvl),
    MinPool: getMinPool(lvl),
    EncounterTiers: getEncounterTiers(lvl, players),
    MaxEnemyPools: maxEnemyPools(lvl, players),
    Enemies: getEnemies(lvl, players).join(", "),
    EnemyAgainstDC: `DC ${getAgainstDC(getTier(lvl))}`,
    ChanceToMissEnemy: `${Math.round(
      (1 - chanceToHitEnemy(getTier(lvl), getPowerLevel(lvl))) * 100
    )}%`,
    ChanceToHitEnemy: `${Math.round(
      chanceToHitEnemy(getTier(lvl), getPowerLevel(lvl)) * 100
    )}%`,
    ChanceToGetHit: `${Math.round(
      chanceToGetHit(getTier(lvl), getPowerLevel(lvl)) * 100
    )}%`,
    MaxRoundsToTPK: maxRoundsToLose(lvl, players),
    Wellspring: totalWellspring(lvl),
  };
  return (
    <>
      {(Object.values(Column) as Column[]).map(
        (column) =>
          columns.includes(column) && (
            <span
              key={column}
              className={`${styles.cell} ${
                i % 2 === 0 ? styles.evenRow : styles.oddRow
              }`}
            >
              {vals[column]}
            </span>
          )
      )}
    </>
  );
}

function ColumnSelect({
  columns,
  setColumns,
}: {
  columns: Column[];
  setColumns: (columns: Column[]) => void;
}) {
  const handleCheckboxChange = (column: Column, on: boolean) => {
    if (!on && columns.includes(column)) {
      setColumns(columns.filter((c) => c.toString() !== column.toString()));
    } else {
      setColumns([...columns, column]);
    }
  };

  return (
    <div className={styles.columnSelect}>
      {(Object.values(Column) as Column[]).map((column, i) => (
        <label key={column}>
          <input
            type="checkbox"
            value={i}
            checked={columns.includes(column)}
            onChange={(e) => handleCheckboxChange(column, e.target.checked)}
          />
          {column}
        </label>
      ))}
    </div>
  );
}

export default function PCLevels() {
  const [columns, setColumns] = useState<Column[]>([Column.Level, Column.Tier]);
  const [players, setPlayers] = useState(4);
  const gridTemplateColumns = `repeat(${columns.length}, 1fr)`;

  return (
    <>
      <input
        type="number"
        value={players}
        onChange={(e) => setPlayers(+e.target.value)}
      />
      <ColumnSelect columns={columns} setColumns={setColumns} />
      <ul className={styles.grid} style={{ gridTemplateColumns }}>
        {(Object.values(Column) as Column[]).map(
          (column) =>
            columns.includes(column) && (
              <span key={column} className={styles.headerCell}>
                {labels[column]}
              </span>
            )
        )}
        {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl, i) => (
          <PCLevel
            key={lvl}
            lvl={lvl}
            columns={columns}
            i={i}
            players={players}
          />
        ))}
      </ul>
    </>
  );
}
