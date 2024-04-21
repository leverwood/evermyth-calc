import { useCallback, useState } from "react";
import { PC } from "../types/types-new-system";
import styles from "./PlayerRewards.module.scss";
import rewardStyles from "./RewardCreatorNew.module.scss";
import { initReward } from "../util/reward-calcs";
import { getPCLearnedFeatures, getPCWellspring, initPC } from "../util/pc-calcs";
import { LOG_LEVEL, Logger } from "../../util/log";
import { SingleRewardText } from "./RewardCreatorNew";
import { RewardOptions } from "../types/reward-types-new";

const logger = Logger(LOG_LEVEL.INFO);

const getPlayersFromStorage = () => {
  const players = localStorage.getItem("players");
  const parsed = players ? JSON.parse(players) : [];
  if (Array.isArray(parsed)) {
    return parsed;
  }
  return [];
};

export function PlayerRewards({ rewards }: { rewards: RewardOptions[] }) {
  const [players, setPlayers] = useState<PC[]>(getPlayersFromStorage());

  return (
    <section className={styles.root}>
      <h1>Player Rewards</h1>
      <AddPlayer setPlayers={setPlayers} />
      <Players players={players} setPlayers={setPlayers} rewards={rewards} />
    </section>
  );
}

function AddPlayer({
  setPlayers,
}: {
  setPlayers: React.Dispatch<React.SetStateAction<PC[]>>;
}) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(1);

  const addPlayer = useCallback(() => {
    setPlayers((prevPlayers: PC[]) => {
      const newPlayers: PC[] = [...prevPlayers, initPC(level, name)];
      localStorage.setItem("players", JSON.stringify(newPlayers));
      return newPlayers;
    });
    setName("");
    setLevel(1);
  }, [level, name, setPlayers]);

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
  setPlayers,
  rewards,
}: {
  players: PC[];
  setPlayers: React.Dispatch<React.SetStateAction<PC[]>>;
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
            setPlayers={setPlayers}
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
  setPlayers,
  rewards,
}: {
  player: PC;
  index: number;
  setPlayers: React.Dispatch<React.SetStateAction<PC[]>>;
  rewards: RewardOptions[];
}) {
  const [name, setName] = useState(player.name);
  const [level, setLevel] = useState(player.level.toString());
  const [eduMod, setEduMod] = useState(
    player.eduMod ? player.eduMod.toString() : ""
  );
  const [playerRewards, setPlayerRewards] = useState(player.rewards);

  const sortedRewards: {
    originalIndex: number;
    reward: RewardOptions;
  }[] = rewards
    .map((reward, i) => ({ originalIndex: i, reward }))
    .sort((r1, r2) =>
      (r1.reward.name || "").localeCompare(r2.reward.name || "")
    );

  // stores the originalIndex of the selected reward
  const [selectedReward, setSelectedReward] = useState<number>(-1);

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

      setPlayers((prevPlayers) => {
        const newPlayers: PC[] = [...prevPlayers];
        newPlayers[index] = {
          ...player,
          [key]: storedValue,
        };
        localStorage.setItem("players", JSON.stringify(newPlayers));
        return newPlayers;
      });
    },
    [index, player, setPlayers]
  );

  const handleDelete = useCallback(() => {
    setPlayers((prevPlayers) => {
      const newPlayers = prevPlayers.filter((_, i) => i !== index);
      localStorage.setItem("players", JSON.stringify(newPlayers));
      return newPlayers;
    });
  }, [index, setPlayers]);

  const handleAddReward = useCallback(
    (rewardOptions: RewardOptions) => {
      const reward = initReward(rewardOptions);
      setPlayerRewards((prevRewards) => {
        const newRewards = [...prevRewards, reward];
        setPlayers((prevPlayers) => {
          const newPlayers = [...prevPlayers];
          newPlayers[index] = {
            ...player,
            rewards: newRewards,
          };
          localStorage.setItem("players", JSON.stringify(newPlayers));
          return newPlayers;
        });
        return newRewards;
      });
      setSelectedReward(-1);
    },
    [index, player, setPlayers]
  );

  const handleDeleteReward = useCallback(
    (rewardIndex: number) => {
      setPlayerRewards((prevRewards) => {
        const newRewards = prevRewards.filter((_, i) => i !== rewardIndex);
        setPlayers((prevPlayers) => {
          const newPlayers = [...prevPlayers];
          newPlayers[index] = {
            ...player,
            rewards: newRewards,
          };
          localStorage.setItem("players", JSON.stringify(newPlayers));
          return newPlayers;
        });
        return newRewards;
      });
    },
    [index, player, setPlayers]
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

        <button onClick={handleDelete} className={rewardStyles.deleteButton}>
          x
        </button>
      </div>
      <div className={styles.playerBody}>
        <p>Can learn {getPCLearnedFeatures(player)} features | Wellspring {getPCWellspring(player.level)}</p>
        <div className={styles.addReward}>
          <select
            id={`${index}-rewards`}
            className={rewardStyles.select}
            onChange={(e) => {
              logger.log(`selected reward: ${e.target.value}`);
              setSelectedReward(parseInt(e.target.value));
            }}
          >
            <option value={-1}>Select Reward</option>
            {sortedRewards.map(({ originalIndex, reward }) => {
              if (playerRewards.find((r) => r.name === reward.name))
                return null;
              if (!reward.name) return null;
              return (
                <option key={originalIndex} value={originalIndex}>
                  {reward.name}
                </option>
              );
            })}
          </select>
          <button
            onClick={() =>
              selectedReward !== -1
                ? handleAddReward(rewards[selectedReward])
                : null
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
