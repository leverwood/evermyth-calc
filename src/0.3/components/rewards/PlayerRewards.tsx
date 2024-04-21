import { useCallback, useState } from "react";
import { SavedPCData } from "../../types/types-new-system";
import styles from "./PlayerRewards.module.scss";
import rewardStyles from "./RewardCreatorNew.module.scss";
import { getRewardOptionsFromIds, initReward } from "../../util/reward-calcs";
import { getPCLearnedFeatures, getPCWellspring } from "../../util/pc-calcs";
import { LOG_LEVEL, Logger } from "../../../util/log";
import { SingleRewardText } from "./SingleRewardText";
import { RewardOptions, RewardOptionsID } from "../../types/reward-types";

const logger = Logger(LOG_LEVEL.INFO);

const getPlayersFromStorage = () => {
  const players = localStorage.getItem("players");
  const parsed = players ? JSON.parse(players) : [];
  if (Array.isArray(parsed)) {
    return parsed;
  }
  return [];
};

type HandleModifyPlayerFunc = (
  index: number,
  player: SavedPCData,
  action: "add" | "update" | "delete"
) => void;

export function PlayerRewards({ rewards }: { rewards: RewardOptions[] }) {
  const [players, setPlayers] = useState<SavedPCData[]>(
    getPlayersFromStorage()
  );

  const handleModifyPlayer: HandleModifyPlayerFunc = useCallback(
    (
      index: number,
      player: SavedPCData,
      action: "add" | "update" | "delete"
    ) => {
      setPlayers((prevPlayers) => {
        const newPlayers = [...prevPlayers];
        switch (action) {
          case "add":
            newPlayers.push(player);
            break;
          case "delete":
            newPlayers.splice(index, 1);
            break;
          case "update":
            newPlayers[index] = player;
            break;
        }
        localStorage.setItem("player", JSON.stringify(newPlayers));
        return newPlayers;
      });
    },
    []
  );

  return (
    <section className={styles.root}>
      <h1>Player Rewards</h1>
      <AddPlayer handleModifyPlayer={handleModifyPlayer} />
      <Players
        players={players}
        handleModifyPlayer={handleModifyPlayer}
        rewards={rewards}
      />
    </section>
  );
}

function AddPlayer({
  handleModifyPlayer,
}: {
  handleModifyPlayer: HandleModifyPlayerFunc;
}) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(1);

  const addPlayer = useCallback(() => {
    const newPC: SavedPCData = {
      name: name,
      level: level,
      rewards: [],
    };
    handleModifyPlayer(-1, newPC, "add");
    setName("");
    setLevel(1);
  }, [level, name, handleModifyPlayer]);

  return (
    <div className={styles.addPlayer}>
      <h2 className={styles.addPlayerTitle}>Add Player</h2>
      <form
        className={styles.addPlayerForm}
        onSubmit={(e) => {
          e.preventDefault();
          addPlayer();
        }}
      >
        <label htmlFor="name" className={styles.label}>
          Name
        </label>
        <input
          id="name"
          className={rewardStyles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <label htmlFor="level" className={styles.label}>
          Level
        </label>
        <input
          id="level"
          className={`${rewardStyles.input} test`}
          type="number"
          value={level}
          onChange={(e) => setLevel(parseInt(e.target.value))}
          placeholder="Level"
        />
        <button onClick={addPlayer} className={styles.button}>
          Add Player
        </button>
      </form>
    </div>
  );
}

function Players({
  players,
  handleModifyPlayer,
  rewards,
}: {
  players: SavedPCData[];
  handleModifyPlayer: HandleModifyPlayerFunc;
  rewards: RewardOptions[];
}) {
  return (
    <div>
      <h2>Players</h2>
      <ul className={styles.playerList}>
        {players.map((player, i) => (
          <Player
            player={player}
            key={player.name}
            index={i}
            handleModifyPlayer={handleModifyPlayer}
            rewards={rewards}
          />
        ))}
      </ul>
    </div>
  );
}

function Player({
  player,
  index,
  handleModifyPlayer,
  rewards,
}: {
  player: SavedPCData;
  index: number;
  handleModifyPlayer: HandleModifyPlayerFunc;
  rewards: RewardOptions[];
}) {
  const [name, setName] = useState(player.name);
  const [level, setLevel] = useState(player.level.toString());
  const [eduMod, setEduMod] = useState(
    player.eduMod ? player.eduMod.toString() : ""
  );
  const playerRewards = getRewardOptionsFromIds(player.rewards, rewards);

  // sort alphabetically
  const sortedRewards: RewardOptions[] = rewards.sort((r1, r2) =>
    (r1.name || "").localeCompare(r2.name || "")
  );

  // stores the originalIndex of the selected reward
  const [selectedReward, setSelectedReward] = useState<string>("-1");

  const handleChange = useCallback(
    (key: "name" | "level" | "eduMod", value: string) => {
      if (key === "name") {
        setName(value);
      } else if (key === "level") {
        setLevel(value);
      } else if (key === "eduMod") {
        setEduMod(value);
      }

      let storedValue =
        key === "level" || key === "eduMod" ? parseInt(value) : value;
      if (typeof storedValue === "number" && isNaN(storedValue)) {
        storedValue = 1;
      }

      const newPlayerData: SavedPCData = {
        ...player,
        [key]: storedValue,
      };

      handleModifyPlayer(index, newPlayerData, "update");
    },
    [index, player, handleModifyPlayer]
  );

  const handleAddReward = useCallback(
    (rewardId: RewardOptionsID) => {
      const newPlayer = {
        ...player,
        rewards: [...player.rewards, rewardId],
      };
      handleModifyPlayer(index, newPlayer, "update");
      setSelectedReward("-1");
    },
    [index, player, handleModifyPlayer]
  );

  const handleDeleteReward = useCallback(
    (rewardIndex: number) => {
      const newRewards = player.rewards.filter((_, i) => i !== rewardIndex);
      const newPlayer = {
        ...player,
        rewards: newRewards,
      };
      handleModifyPlayer(index, newPlayer, "update");
      return newRewards;
    },
    [index, player, handleModifyPlayer]
  );

  return (
    <div className={styles.player}>
      <div className={styles.playerHeader}>
        <input
          id={`name-${index}`}
          className={rewardStyles.input}
          value={name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Name"
        />
        <label htmlFor={`level-${index}`} className={styles.label}>
          Level
        </label>
        <input
          id={`level-${index}`}
          className={rewardStyles.input}
          type="number"
          value={level}
          onChange={(e) => handleChange("level", e.target.value)}
          min={1}
        />
        <label htmlFor={`eduMod-${index}`} className={styles.label}>
          EDU mod
        </label>
        <input
          id={`eduMod-${index}`}
          className={rewardStyles.input}
          type="number"
          value={eduMod}
          onChange={(e) => handleChange("eduMod", e.target.value)}
          min={0}
        />

        <button
          onClick={() => handleModifyPlayer(index, player, "delete")}
          className={rewardStyles.deleteButton}
        >
          x
        </button>
      </div>
      <div className={styles.playerBody}>
        <p>
          Can learn {getPCLearnedFeatures(player)} features | Wellspring{" "}
          {getPCWellspring(player.level)}
        </p>
        <div className={styles.addReward}>
          <select
            id={`${index}-rewards`}
            className={rewardStyles.select}
            onChange={(e) => setSelectedReward(e.target.value)}
          >
            <option value={-1}>Select Reward</option>
            {sortedRewards.map((reward, i) => {
              if (playerRewards.find((r) => r.name === reward.name))
                return null;
              if (!reward.name) return null;
              return (
                <option key={i} value={reward.id}>
                  {reward.name}
                </option>
              );
            })}
          </select>
          <button
            onClick={() =>
              selectedReward !== "-1" ? handleAddReward(selectedReward) : null
            }
            className={rewardStyles.button}
          >
            ADD
          </button>
        </div>
        <ul className={styles.rewardsList}>
          {playerRewards.map((opt, i) => {
            const reward = initReward(opt);
            return (
              <li className={styles.playerReward} key={i}>
                <button
                  className={rewardStyles.button}
                  onClick={() => handleDeleteReward(i)}
                >
                  x
                </button>
                <SingleRewardText reward={reward} oneLine={true} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
