import { useState, useCallback, useEffect } from "react";
import {
  PCRollOptions,
  Enemy,
  Creatures,
  EnemyTurnData,
  PCTurnData,
  RoundData,
  InitiativeCount,
  INITIAL_SIMULATION_DATA,
  SimulationData,
  EnemyAttackData,
  PCAction,
  Condition,
  PC,
} from "../types/system-types";
import { getTier } from "../../util/calcs";
import { getEnemyPool, getEnemyWellspring } from "../util/enemy-calc";
import { makeEnemyInitiative, makeRandomEnemy } from "../util/simulate-enemy";
import { makeRandomEnemyTiers } from "../util/simulate-enemy";
import { getPCMaxPool, getPCWellspring } from "../util/pc-calcs";
import { printPercent } from "../../util/print";
import { doSimulation, printCreatureName } from "../util/simulate";
import { randomPC } from "../util/simulate-pc";
import styles from "./Simulation.module.scss";
import { PCRoll } from "../util/dice-calcs";
import { initReward } from "../../rewards/util/reward-calcs";
import { Reward } from "../../rewards/types/reward-types";
import { SingleRewardText } from "../../rewards/components/SingleRewardText";

export default function Simulation({
  level,
  numPCs,
}: {
  level: number;
  numPCs: number;
}) {
  const defaultEnemies = makeRandomEnemyTiers(
    getTier(level) * numPCs,
    numPCs,
    getTier(level)
  );
  const [enemiesStr, setEnemiesStr] = useState(defaultEnemies.join(","));
  const [enemyTiers, setEnemyTiers] = useState(defaultEnemies);
  const [advToHit, setAdvToHit] = useState(true);
  const [advToDefend, setAdvToDefend] = useState(true);
  const [trainedToHit, setTrainedToHit] = useState(true);
  const [trainedToDefend, setTrainedToDefend] = useState(true);
  const [advToHeal, setAdvToHeal] = useState(false);
  const [trainedToHeal, setTrainedToHeal] = useState(false);
  const [results, setResults] = useState(INITIAL_SIMULATION_DATA);

  const onClickRandomEnemies = useCallback(() => {
    const enemies = makeRandomEnemyTiers(
      getTier(level) * numPCs,
      numPCs,
      getTier(level)
    );
    setEnemiesStr(enemies.join(","));
    setEnemyTiers(enemies);
  }, [level, numPCs]);

  useEffect(() => {
    const options: PCRollOptions = {
      advToHit,
      advToDefend,
      trainedToHit,
      trainedToDefend,
      advToHeal,
      trainedToHeal,
      pcsWillFlee: false,
      doInteraction: false,
    };

    const enemyCreatures: Enemy[] = enemyTiers.map((enemyTier, i) =>
      makeRandomEnemy(enemyTier, i)
    );

    const creatures: Creatures = {
      GM: {
        enemies: enemyCreatures,
        // random number from 1-4
        initiative: makeEnemyInitiative(enemyCreatures),
      },
      pcs: [],
    };

    // each pc rolls initiative
    for (let i = 0; i < numPCs; i++) {
      creatures.pcs.push(randomPC(i, level));
    }

    setResults(doSimulation(creatures, options));
  }, [
    advToDefend,
    advToHeal,
    advToHit,
    enemyTiers,
    level,
    numPCs,
    trainedToDefend,
    trainedToHeal,
    trainedToHit,
  ]);

  return (
    <section>
      <h1>Bullet Time</h1>
      <p>
        Assumptions: PCs will immediately try to heal downed pcs. Each pc has 1
        healing potion, which automatically succeeds and is consumed. PCs attack
        enemies at random, and enemies do the same. TODO: No AoE to deal more
        damage
      </p>
      <label>Enemies</label>
      <input
        value={enemiesStr}
        onChange={(e) => {
          setEnemiesStr(e.target.value);
          setEnemyTiers(e.target.value.split(",").map((x) => parseInt(x)));
        }}
        min={1}
        max={20}
      />
      <button onClick={onClickRandomEnemies}>Randomize</button>
      <br />
      <label>Advantage to Hit</label>
      <input
        type="checkbox"
        checked={advToHit}
        onChange={(e) => setAdvToHit(e.target.checked)}
        min={1}
        max={20}
      />
      <br />
      <label>Advantage to Defend</label>
      <input
        type="checkbox"
        checked={advToDefend}
        onChange={(e) => setAdvToDefend(e.target.checked)}
        min={1}
        max={20}
      />
      <br />
      <label>Trained to Hit</label>
      <input
        type="checkbox"
        checked={trainedToHit}
        onChange={(e) => setTrainedToHit(e.target.checked)}
        min={1}
        max={20}
      />
      <br />
      <label>Trained to Defend</label>
      <input
        type="checkbox"
        checked={trainedToDefend}
        onChange={(e) => setTrainedToDefend(e.target.checked)}
        min={1}
        max={20}
      />
      <br />
      <label>Advantage to Heal</label>
      <input
        type="checkbox"
        checked={advToHeal}
        onChange={(e) => setAdvToHeal(e.target.checked)}
        min={1}
        max={20}
      />
      <br />
      <label>Trained to Heal</label>
      <input
        type="checkbox"
        checked={trainedToHeal}
        onChange={(e) => setTrainedToHeal(e.target.checked)}
        min={1}
        max={20}
      />
      <p>
        Total PC Tier: {getTier(level) * numPCs} | Total Enemy Tier:{" "}
        {enemyTiers.reduce((reduced, tier) => reduced + tier, 0)} | Total Enemy
        ❤️{" "}
        {results.creatures.GM.enemies.reduce(
          (reduced, enemy) => reduced + enemy.pool,
          0
        )}
      </p>
      <p>
        Enemy Pools:{" "}
        {results.creatures.GM.enemies
          .map((e) => getEnemyPool(e.tier))
          .join(",")}
      </p>
      {!results.creatures.GM.enemies.length ||
      !results.creatures.pcs.length ||
      enemyTiers.filter((e) => isNaN(e)).length ? null : (
        <SimulationResults simulation={results} />
      )}
      <h2>Creatures</h2>
      {results.creatures.GM.enemies.map((enemy, i) => (
        <p key={i}>
          {printCreatureName(enemy)}: Tier {enemy.tier} | ❤️{enemy.pool}/
          {getEnemyPool(enemy.tier)} | Initiative{" "}
          {results.creatures.GM.initiative}
        </p>
      ))}
      {results.creatures.pcs.map((pc, i) => (
        <p key={i}>
          {printCreatureName(pc)}: Level {pc.level} | Pool {pc.pool} |
          Initiative {pc.initiative} | Wellspring {pc.wellspring}/
          {pc.startingWellspring}
        </p>
      ))}
      <Rounds rounds={results.rounds} creatures={results.creatures} />
    </section>
  );
}

export function SimulationResults({
  simulation,
}: {
  simulation: SimulationData;
}) {
  const {
    enemiesAlive,
    pcsAlive,
    pcsFled,
    hitRolls,
    hitSuccesses,
    hitDouble,
    hitTriple,
    dodgeRolls,
    dodgeSuccesses,
    dodgeHalfSuccesses,
    healRolls,
    healSuccesses,
    downed,
    rounds,
  } = simulation;
  return (
    <>
      <h2>Results</h2>
      <p>
        Rounds {rounds.length} | Enemies left {enemiesAlive.length} | PCs alive{" "}
        {pcsAlive.length} | PCs fled {pcsFled.length}
      </p>
      <ul>
        <li>PCs were downed {downed} times</li>
        <li>
          Made {hitSuccesses} hits out of {hitRolls} rolls (
          {printPercent(hitSuccesses / hitRolls)}). {hitDouble} double hits.{" "}
          {hitTriple} triple hits.
        </li>
        <li>
          Fully dodged {dodgeSuccesses} out of {dodgeRolls} rolls (
          {printPercent(dodgeSuccesses / dodgeRolls)})
        </li>
        <li>
          Half dodged {dodgeHalfSuccesses} out of {dodgeRolls} rolls (
          {printPercent(dodgeHalfSuccesses / dodgeRolls)})
        </li>
        {healRolls > 0 ? (
          <li>
            Healed {healSuccesses} out of {healRolls} rolls (
            {printPercent(healSuccesses / healRolls)})
          </li>
        ) : null}
      </ul>
    </>
  );
}

export function Aftermath({ simulation }: { simulation: SimulationData }) {
  return (
    <section>
      <h1>Aftermath</h1>
      <ul>
        <li>
          PCs alive: {simulation.pcsAlive.map(printCreatureName).join(", ")}{" "}
        </li>
        <li>
          PCs fled: {simulation.pcsFled.map(printCreatureName).join(", ")}{" "}
        </li>
        <li>
          Enemies alive:{" "}
          {simulation.enemiesAlive.map(printCreatureName).join(", ")}
        </li>
      </ul>
      PCs
      <ul>
        {simulation.creatures.pcs.map((pc, i) => (
          <li key={`pc-${i}`}>
            {printCreatureName(pc)}: {pc.dead ? "💀" : "❤️"} {pc.pool} | ⭐{" "}
            {pc.wellspring} | fled {pc.fledRounds} rounds
          </li>
        ))}
      </ul>
      Enemies
      <ul>
        {simulation.creatures.GM.enemies.map((enemy, i) => (
          <li key={`e-${i}`}>
            {printCreatureName(enemy)}: {enemy.pool === 0 ? "💀" : "❤️"}{" "}
            {enemy.pool} | ⭐ {enemy.wellspring}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Rounds({
  rounds,
  creatures,
}: {
  rounds: RoundData[];
  creatures: Creatures;
}) {
  return (
    <>
      <h2>Rounds</h2>
      {rounds.map((round, i) => (
        <Round key={i} round={round} creatures={creatures} />
      ))}
    </>
  );
}

function Round({
  round,
  creatures,
}: {
  round: RoundData;
  creatures: Creatures;
}) {
  return (
    <>
      <h3 className={styles.roundTitle}>Round {round.round}</h3>
      <p className={styles.roundIntro}>
        PCs left {round.pcsRemain} | Enemies left {round.enemiesRemain} | Enemy
        Pool {round.enemyPoolRemains}
      </p>
      {round.initiative.map((init, i) => (
        <Initiative key={i} init={init} creatures={creatures} />
      ))}
    </>
  );
}

function Initiative({
  init,
  creatures,
}: {
  init: InitiativeCount;
  creatures: Creatures;
}) {
  if (init.turns.length === 0) return null;

  return (
    <div className={styles.initiative}>
      <h4 className={styles.initiativeTitle}>
        Initiative {init.initiativeCount}: PCs {init.pcsRemain}/
        {creatures.pcs.length} | Enemies {init.enemiesRemain}/
        {creatures.GM.enemies.length}
      </h4>
      <ul className={styles.turns}>
        {init.turns.map((turn, i) =>
          turn.type === "pc_turn" ? (
            <PCTurn key={i} turn={turn} />
          ) : (
            <EnemyTurn key={i} turn={turn} />
          )
        )}
      </ul>
    </div>
  );
}

const PrintRoll = ({ needed, roll }: { needed?: number; roll?: PCRoll }) =>
  !needed || !roll ? null : (
    <>
      Target {needed}, rolled {roll?.total}{" "}
      <span className={styles.diceResult}>{roll?.dice.join(" + ")}</span>
    </>
  );

const UsedWellspring = ({ usedWellspring }: { usedWellspring?: number }) => (
  <>{usedWellspring ? `Used ⭐${usedWellspring}. ` : ""}</>
);

const UsedFortune = ({ usedFortune }: { usedFortune?: number }) => (
  <>{usedFortune ? `Used ${usedFortune} 🪙fortune. ` : ""}</>
);

const UsedReward = ({ usedReward }: { usedReward?: Reward }) => (
  <>{usedReward ? `Used ${usedReward.name}. ` : ""}</>
);

export function CreaturesDisplay({ creatures }: { creatures: Creatures }) {
  return (
    <>
      <h3>Creatures</h3>
      {creatures.GM.enemies.map((enemy, i) => (
        <div key={`enemy-${i}`}>
          <p key={i}>
            {printCreatureName(enemy)}: Tier {enemy.tier} | Pool{" "}
            {getEnemyPool(enemy.tier)} | Wellspring{" "}
            {getEnemyWellspring(enemy.tier)}
          </p>
          <ul>
            {enemy.rewards.map((r, i) => (
              <RewardDisplay key={i} reward={initReward(r)} />
            ))}
          </ul>
        </div>
      ))}
      {creatures.pcs.map((pc, i) => (
        <div key={`creature-${i}`}>
          <p key={i}>
            {pc.name}: Level {pc.level} | Tier {getTier(pc.level)} | Pool{" "}
            {pc.startingPool} max: {getPCMaxPool(pc.level)} | Initiative{" "}
            {pc.initiative} | Wellspring {pc.startingWellspring} max:{" "}
            {getPCWellspring(pc.level)}
          </p>
          <ul>
            {pc.rewards.map((r, i) => (
              <RewardDisplay key={i} reward={initReward(r)} />
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export function RewardDisplay({ reward }: { reward: Reward }) {
  return (
    <p>
      <SingleRewardText reward={reward} oneLine={true} />
    </p>
  );
}

function PCTurn({ turn }: { turn: PCTurnData }) {
  const { action, pc } = turn;
  return (
    <li className={styles.turn}>
      <h4 className={`${styles.turnTitle} ${styles.pcTurnTitle}`}>
        👤 {pc.name} (T{getTier(pc.level)}) | ❤️{turn.snapshot.pool} | ⭐
        {turn.snapshot.wellspring} | 🪙{turn.snapshot.fortune} | 💀
        {turn.snapshot.deathFails}
      </h4>
      <ul className={styles.turnActions}>
        <ConditionsDisplay conditions={turn.snapshot.conditions} />
        <DeathSave deathSave={turn.deathSave} snapshot={turn.snapshot} />
        <PCActionDisplay action={turn.interaction} turn={turn} />
        <PCActionDisplay action={action} turn={turn} />
      </ul>
    </li>
  );
}

const DeathSave = ({
  deathSave,
  snapshot,
}: {
  deathSave?: number;
  snapshot: PC;
}) => (!deathSave ? null : <li>DEATH SAVE: {deathSave}.</li>);

function PCActionDisplay({
  action,
  turn,
}: {
  action?: PCAction;
  turn: PCTurnData;
}) {
  if (!action) return null;
  return action.type === "ATTACK" ? (
    <PCAttack turn={turn} />
  ) : action.type === "HEAL" ? (
    <PCHeal turn={turn} />
  ) : action.type === "FLEE" ? (
    <li>
      <span className={`${styles.actionLabel} ${styles.fleeLabel}`}>FLEE</span>
    </li>
  ) : action.type === "HELP" ? (
    <li>
      <span className={`${styles.actionLabel} ${styles.helpLabel}`}>HELP</span>
      {action.message}
    </li>
  ) : action.type === "SKIP" ? (
    <li>SKIP: {action.message}</li>
  ) : action.type === "OTHER" ? (
    <li>OTHER: {action.message}</li>
  ) : null;
}

function PCHeal({ turn }: { turn: PCTurnData }) {
  if (!turn.action) return null;
  const { dealt, roll, needed, usedFortune, usedWellspring, withPCs } =
    turn.action;

  return (
    <li className={styles.attack}>
      <UsedReward usedReward={turn.action.usedReward} />
      {dealt ? (
        <>
          <span className={`${styles.actionLabel} ${styles.healLabel}`}>
            HEAL
          </span>
          Healed {withPCs?.map((p) => p.name).join(", ")} for {dealt}.
          <UsedFortune usedFortune={usedFortune} />{" "}
        </>
      ) : (
        <>
          <span className={`${styles.actionLabel} ${styles.missLabel}`}>
            HEAL MISS
          </span>{" "}
          Failed to heal {withPCs?.map((p) => p.name).join(", ")}.{" "}
        </>
      )}
      {roll ? <PrintRoll needed={needed} roll={roll} /> : null}
      <UsedWellspring usedWellspring={usedWellspring} />
      <span>{turn.action.message}</span>
    </li>
  );
}

function PCAttack({ turn }: { turn: PCTurnData }) {
  if (!turn.action) return null;
  const {
    dealt,
    killed,
    roll,
    needed,
    usedFortune,
    usedWellspring,
    hitTimes,
    againstEnemies,
  } = turn.action;

  const enemyList = againstEnemies
    ?.map((e) => `enemy ${e.enemy.number} (T${e.enemy.tier})`)
    .join(", ");

  if (turn.action?.dealt) {
    return (
      <li className={styles.attack}>
        <UsedReward usedReward={turn.action.usedReward} />
        <span>{turn.action.message}</span>
        <span className={`${styles.actionLabel} ${styles.hitLabel}`}>HIT</span>
        {killed?.length ? (
          <span className={`${styles.actionLabel} ${styles.killLabel}`}>
            KILL
          </span>
        ) : null}
        Hit {enemyList}. <PrintRoll needed={needed} roll={roll} />. Dealt{" "}
        {dealt} damage
        {hitTimes && hitTimes > 1 ? (
          <span className={styles.diceResult}>x{hitTimes}</span>
        ) : null}
        . ❤️{againstEnemies?.map((e) => e.pool).join(", ")}.{" "}
        <UsedWellspring usedWellspring={usedWellspring} />{" "}
        <UsedFortune usedFortune={usedFortune} />
      </li>
    );
  } else {
    return (
      <li>
        <UsedReward usedReward={turn.action.usedReward} />
        <span>{turn.action.message}</span>
        <span className={`${styles.actionLabel} ${styles.missLabel}`}>
          MISS
        </span>
        Missed {enemyList}. <PrintRoll needed={needed} roll={roll} />.
        <UsedWellspring usedWellspring={usedWellspring} />{" "}
        <UsedFortune usedFortune={usedFortune} />
      </li>
    );
  }
}

function EnemyTurn({ turn }: { turn: EnemyTurnData }) {
  const { enemy, action, attacked } = turn;
  return (
    <li className={styles.turn}>
      <h4 className={`${styles.turnTitle} ${styles.enemyTurnTitle}`}>
        😡 {printCreatureName(enemy)} (T{enemy.tier}) | ❤️{turn.snapshot.pool}
      </h4>
      <ul>
        <ConditionsDisplay conditions={turn.snapshot.conditions} />
        <UsedReward usedReward={turn.usedReward} />
        {action === "ATTACK"
          ? attacked.map((attack, i) => <EnemyAttack key={i} attack={attack} />)
          : action === "FLEE"
          ? null
          : action === "SKIP"
          ? null
          : null}
      </ul>
    </li>
  );
}

function ConditionsDisplay({ conditions }: { conditions: Condition[] }) {
  if (!conditions.length) return null;
  return (
    <li>
      <em>Conditions:</em>{" "}
      {conditions.map((c, i) => (
        <span key={i}>
          {c.name} {c.duration ? `(${c.duration} rounds)` : ""}{" "}
        </span>
      ))}
    </li>
  );
}

function EnemyAttack({ attack }: { attack: EnemyAttackData }) {
  return (
    <li>
      {attack.partialDodge && attack.damage ? (
        <>
          <span
            className={`${styles.actionLabel} ${styles.partialAttackLabel}`}
          >
            PARTIAL DODGE
          </span>
        </>
      ) : !attack.damage ? (
        <span className={`${styles.actionLabel} ${styles.missLabel}`}>
          DODGE
        </span>
      ) : attack.damage ? (
        <>
          <span className={`${styles.actionLabel} ${styles.attackLabel}`}>
            HIT
          </span>
        </>
      ) : null}

      {attack.downed ? (
        <span className={`${styles.actionLabel} ${styles.attackLabel}`}>
          DOWN
        </span>
      ) : null}

      {`${attack.pc.name} `}
      {attack.damage
        ? `takes ${attack.damage} damage, ${attack.pcPool} remaining.`
        : null}

      <PrintRoll needed={attack.needed} roll={attack.roll} />
      {attack.message || ""}
    </li>
  );
}
