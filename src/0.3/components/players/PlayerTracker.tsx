import { useCallback, useState } from "react";
import { Button, Accordion, Form, ListGroup } from "react-bootstrap";

import { SavedPCData } from "../../types/system-types";
import styles from "./PlayerTracker.module.scss";
import { getRewardOptionsFromId, initReward } from "../../util/reward-calcs";
import { getPCLearnedFeatures, getPCWellspring } from "../../util/pc-calcs";
import { SingleRewardText } from "../rewards/SingleRewardText";
import { Reward, RewardOptions } from "../../types/reward-types";
import { getRewardsFromStorage } from "../../util/reward-make";
import { PlayerBasicInfo } from "./PlayerBasicInfo";
import AddReward from "./AddReward";
import { HandleModifyPlayerFunc } from "../../types/pc-types";

const defaultActivePlayer = "3";

const getPlayersFromStorage = () => {
  const players = localStorage.getItem("players");
  const parsed = players ? JSON.parse(players) : [];
  if (Array.isArray(parsed)) {
    return parsed;
  }
  return [];
};

export default function PlayerTracker() {
  const [players, setPlayers] = useState<SavedPCData[]>(
    getPlayersFromStorage()
  );
  const [mode, setMode] = useState<"view" | "edit">("edit");
  const rewards = getRewardsFromStorage();

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
        localStorage.setItem("players", JSON.stringify(newPlayers));
        return newPlayers;
      });
    },
    []
  );

  return (
    <section className={styles.root}>
      <h1>Player Rewards</h1>
      <AddPlayer handleModifyPlayer={handleModifyPlayer} />
      <Button onClick={() => setMode(mode === "view" ? "edit" : "view")}>
        {mode === "view" ? "Edit Mode" : "View Mode"}
      </Button>
      <Players
        mode={mode}
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
    <Form
      className={`${styles.addPlayerForm} mb-4 mt-4`}
      onSubmit={(e) => {
        e.preventDefault();
        addPlayer();
      }}
    >
      <Form.Label className={"me-2"} htmlFor="name">
        Name
      </Form.Label>
      <Form.Control
        id="name"
        className={`${styles.addPlayerInput} me-2`}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <Form.Label className={"me-2"} htmlFor="level">
        Level
      </Form.Label>
      <Form.Control
        id="level"
        className={`${styles.levelInput} me-2`}
        type="number"
        value={level}
        onChange={(e) => setLevel(parseInt(e.target.value))}
        placeholder="Level"
      />
      <Button type="submit" variant="success" onClick={addPlayer}>
        Add Player
      </Button>
    </Form>
  );
}

function Players({
  players,
  handleModifyPlayer,
  rewards,
  mode,
}: {
  players: SavedPCData[];
  handleModifyPlayer: HandleModifyPlayerFunc;
  rewards: RewardOptions[];
  mode: "view" | "edit";
}) {
  return (
    <div>
      <Accordion defaultActiveKey={defaultActivePlayer}>
        {players.map((player, i) => (
          <Player
            player={player}
            key={player.name}
            index={i}
            handleModifyPlayer={handleModifyPlayer}
            rewards={rewards}
            mode={mode}
          />
        ))}
      </Accordion>
    </div>
  );
}

function Player({
  player,
  index,
  handleModifyPlayer,
  rewards,
  mode,
}: {
  player: SavedPCData;
  index: number;
  handleModifyPlayer: HandleModifyPlayerFunc;
  rewards: RewardOptions[];
  mode: "view" | "edit";
}) {
  // ids are player.rewards
  const playerRewards = player.rewards.map((id, i) => {
    return {
      id,
      data: initReward(getRewardOptionsFromId(id, rewards) || {}),
    };
  });

  const sortedRewards = playerRewards.sort((a, b) =>
    a.data.name.localeCompare(b.data.name)
  );

  const handleDeleteReward = useCallback(
    (deleteId: string) => {
      // these are reward ids
      const newRewards = player.rewards.filter((id) => deleteId !== id);
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
    <Accordion.Item eventKey={index.toString()}>
      <Accordion.Header>
        <strong>{player.name}&nbsp;</strong> | Can learn{" "}
        {getPCLearnedFeatures(player)} features | Wellspring{" "}
        {getPCWellspring(player.level)}
      </Accordion.Header>
      <Accordion.Body>
        <PlayerBasicInfo {...{ index, handleModifyPlayer, player }} />
        {mode === "view" ? null : (
          <AddReward
            {...{ index, playerRewards, rewards, handleModifyPlayer, player }}
          />
        )}
        {mode === "view" ? (
          <RewardListView sortedRewards={sortedRewards} />
        ) : (
          <RewardListEdit
            sortedRewards={sortedRewards}
            handleDeleteReward={handleDeleteReward}
          />
        )}
        <Button
          onClick={() => handleModifyPlayer(index, player, "delete")}
          variant="danger"
        >
          Delete {player.name}
        </Button>
      </Accordion.Body>
    </Accordion.Item>
  );
}

function RewardListEdit({
  sortedRewards,
  handleDeleteReward,
}: {
  sortedRewards: {
    id: string;
    data: Reward;
  }[];
  handleDeleteReward: (id: string) => string[];
}) {
  return (
    <ListGroup className={`mb-4`} variant="flush">
      {sortedRewards.map(({ id, data }, i) => (
        <ListGroup.Item className={styles.playerReward}>
          <Button
            size="sm"
            variant="outline-danger"
            className="me-2 px-2"
            onClick={() => handleDeleteReward(id)}
          >
            &nbsp;x&nbsp;
          </Button>
          <SingleRewardText reward={data} oneLine={true} />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

function RewardListView({
  sortedRewards,
}: {
  sortedRewards: {
    id: string;
    data: Reward;
  }[];
}) {
  return (
    <ul>
      {sortedRewards.map(({ id, data }, i) => (
        <li key={id}>
          <SingleRewardText reward={data} oneLine={true} />
        </li>
      ))}
    </ul>
  );
}