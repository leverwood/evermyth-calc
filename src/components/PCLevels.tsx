import React, { useState } from "react";
import styles from "./PCLevels.module.scss";
import {
  getDCEasy,
  getDCHard,
  getDCMedium,
  getTier,
  totalPCWellspring,
} from "../util/calcs";
import { ABILITY_MIN_LVL } from "../util/constants";
import {
  chanceToGetHit,
  chanceToHitEnemy,
  getAgainstDC,
  getEncounterTiers,
  getEnemies,
  maxEnemyPools,
  roundsToLose,
  maxRoundsToWin,
  minRoundsToWin,
  getDefenseDC,
  totalEnemyWellspring,
} from "../util/enemy-calcs";
import {
  getMaxAbilty,
  getPowerLevel,
  getMaxPool,
  getMinPool,
} from "../util/pc-calcs";
import {
  getEnemyRewardMaxDealt,
  getPCRewardMaxDealt,
  getRewardMinDealt,
} from "../util/reward-calcs";
import {
  flatToRolled,
  flatToRolledPrint,
  printAllFormulaData,
  printDiceFormula,
} from "../util/dice-calcs";

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
  DCEasy = "DCEasy",
  DCMedium = "DCMedium",
  DCHard = "DCHard",
  RewardMinDealt = "RewardMinDealt",
  RewardMaxDealt = "RewardMaxDealt",
  RewardEnemyMaxDealt = "RewardEnemyMaxDealt",
  MaxEnemyPools = "MaxEnemyPools",
  EnemyPoolsToPlayerPools = "EnemyPoolsToPlayerPools",
  Enemies = "Enemies",
  EncounterTiers = "EncounterTiers",
  EnemyAgainstDC = "EnemyAgainstDC",
  EnemyDefenseDC = "EnemyDefenseDC",
  ChanceToMissEnemy = "ChanceToMissEnemy",
  ChanceToHitEnemy = "ChanceToHitEnemy",
  ChanceToGetHit = "ChanceToGetHit",
  RoundsToTPK = "RoundsToTPK",
  MaxRoundsToWin = "MaxRoundsToWin",
  MinRoundsToWin = "MinRoundsToWin",
  Wellspring = "Wellspring",
  EnemyWellspring = "EnemyWellspring",
}

const DEFAULT_COLUMNS: Column[] = [
  Column.Level,
  Column.Tier,
  Column.MaxPool,
  Column.MaxEnemyPools,
  Column.RewardMinDealt,
  Column.RewardMaxDealt,
  Column.RewardEnemyMaxDealt,
  Column.RoundsToTPK,
  Column.MaxRoundsToWin,
  Column.MinRoundsToWin,
  Column.EnemyPoolsToPlayerPools,
];

const labels: { [K in keyof typeof Column]: string } = {
  Level: "Level",
  Tier: "Tier",
  MinAbility: "Min Ability",
  MaxAbility: "Max Ability",
  PowerLevel: "Power Level",
  MaxPool: "Max Pool",
  MinPool: "Min Pool",
  DCEasy: "DC Easy",
  DCMedium: "DC Medium",
  DCHard: "DC Hard",
  RewardMinDealt: "Reward Min Dealt",
  RewardMaxDealt: "Reward PC Max Dealt",
  MaxEnemyPools: "Max Enemy Pools",
  EnemyPoolsToPlayerPools: "Enemy Pools To Player Pools",
  RewardEnemyMaxDealt: "Reward Enemy Max Dealt",
  EncounterTiers: "Encounter Tiers",
  Enemies: "Enemies",
  EnemyAgainstDC: "Enemy Against DC",
  EnemyDefenseDC: "Enemy Defense DC",
  ChanceToMissEnemy: "Chance To Miss Enemy, Best Modifier, Advantage",
  ChanceToHitEnemy: "Chance To Hit Enemy, Best Mod, Advantage",
  ChanceToGetHit: "Chance To Get Hit, Best Mod",
  RoundsToTPK: "Rounds To TPK",
  MaxRoundsToWin: "Max Rounds To Win",
  MinRoundsToWin: "Min Rounds To Win",
  Wellspring: "Wellspring",
  EnemyWellspring: "Enemy Wellspring",
};

function PCLevel({ lvl, columns, i, players }: PCLevelProps) {
  const tier = getTier(lvl);
  const vals: {
    readonly [K in keyof typeof Column]: number | string;
  } = {
    Level: "lvl " + lvl,
    Tier: "T" + tier,
    MinAbility: ABILITY_MIN_LVL,
    MaxAbility: "+" + getMaxAbilty(lvl),
    PowerLevel: "+" + getPowerLevel(lvl),
    MaxPool: getMaxPool(lvl),
    MinPool: getMinPool(lvl),
    DCEasy: `DC ${getDCEasy(tier)}`,
    DCMedium: `DC ${getDCMedium(tier)}`,
    DCHard: `DC ${getDCHard(tier)}`,
    RewardMinDealt: printAllFormulaData(flatToRolled(getRewardMinDealt(tier))),
    RewardMaxDealt: printAllFormulaData(flatToRolled(getPCRewardMaxDealt(lvl))),
    RewardEnemyMaxDealt: flatToRolledPrint(getEnemyRewardMaxDealt(tier)),
    EncounterTiers: getEncounterTiers(lvl, players),
    MaxEnemyPools: maxEnemyPools(lvl, players),
    EnemyPoolsToPlayerPools: `${maxEnemyPools(lvl, players)} / ${
      players * getMaxPool(lvl)
    } (${(
      (maxEnemyPools(lvl, players) / (players * getMaxPool(lvl))) *
      100
    ).toFixed(0)}%)`,
    Enemies: getEnemies(lvl, players).join(", "),
    EnemyAgainstDC: `DC ${getAgainstDC(tier)}`,
    EnemyDefenseDC: `DC ${getDefenseDC(tier)}`,
    ChanceToMissEnemy: `${Math.round(
      (1 - chanceToHitEnemy(tier, getPowerLevel(lvl))) * 100
    )}%`,
    ChanceToHitEnemy: `${Math.round(
      chanceToHitEnemy(tier, getPowerLevel(lvl)) * 100
    )}%`,
    ChanceToGetHit: `${Math.round(
      chanceToGetHit(tier, getPowerLevel(lvl)) * 100
    )}%`,
    RoundsToTPK: roundsToLose(lvl, players),
    MaxRoundsToWin: maxRoundsToWin(lvl, players),
    MinRoundsToWin: minRoundsToWin(lvl, players),
    Wellspring: totalPCWellspring(lvl),
    EnemyWellspring: totalEnemyWellspring(tier),
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
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
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
