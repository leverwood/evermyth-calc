import { useCallback, useState } from "react";
import { Button, Accordion, Form, ListGroup } from "react-bootstrap";

import { PlayerData } from "../types/pc-types";
import styles from "./PlayerTracker.module.scss";
import {
  getRewardDataFromId,
  initReward,
} from "../../rewards/util/reward-calcs";
import { getPCLearnedFeatures, getPCWellspring } from "../../0.3/util/pc-calcs";
import { SingleRewardText } from "../../rewards/components/SingleRewardText";
import { Reward, RewardData } from "../../rewards/types/reward-types";
import { getRewardsFromStorage } from "../../rewards/util/reward-make";
import { PlayerBasicInfo } from "./PlayerBasicInfo";
import AddReward from "./AddReward";
import { HandleModifyPlayerFunc } from "../types/pc-types";

const getPlayersFromStorage = () => {
  const players = localStorage.getItem("players");
  const parsed = players ? JSON.parse(players) : [];
  if (Array.isArray(parsed)) {
    return parsed;
  }
  return [];
};

export default function PlayerTracker() {
  const [players, setPlayers] = useState<PlayerData[]>(getPlayersFromStorage());
  const [mode, setMode] = useState<"view" | "edit">("edit");
  const rewards = getRewardsFromStorage();

  const handleModifyPlayer: HandleModifyPlayerFunc = useCallback(
    (id: string, data: PlayerData, action: "add" | "update" | "delete") => {
      setPlayers((prevPlayers) => {
        const newPlayers = [...prevPlayers];
        const playerIndex = newPlayers.findIndex((p) => p.id === id);
        switch (action) {
          case "add":
            newPlayers.push(data);
            break;
          case "delete":
            newPlayers.splice(playerIndex, 1);
            break;
          case "update":
            newPlayers[playerIndex] = data;
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
    console.log("adding player", name, level);
    const id = crypto.randomUUID();
    const newPC: PlayerData = {
      id,
      name: name,
      level: level,
      rewards: [],
    };
    handleModifyPlayer(id, newPC, "add");
    setName("");
    setLevel(1);
  }, [level, name, handleModifyPlayer]);

  return (
    <Form className={`${styles.addPlayerForm} mb-4 mt-4`}>
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
  players: PlayerData[];
  handleModifyPlayer: HandleModifyPlayerFunc;
  rewards: RewardData[];
  mode: "view" | "edit";
}) {
  return (
    <div>
      <Accordion>
        {players
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((player, i) => {
            if (!player)
              player = {
                id: "",
                name: "Unknown",
                level: 1,
                rewards: [],
              };
            return (
              <Player
                player={player}
                key={player.name + player.id + i}
                index={i}
                handleModifyPlayer={handleModifyPlayer}
                rewards={rewards}
                mode={mode}
              />
            );
          })}
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
  player: PlayerData;
  index: number;
  handleModifyPlayer: HandleModifyPlayerFunc;
  rewards: RewardData[];
  mode: "view" | "edit";
}) {
  // ids are player.rewards
  const playerRewards = player.rewards.map((id, i) => {
    return {
      id,
      data: initReward(getRewardDataFromId(id, rewards) || {}),
    };
  });

  const sortedRewards = playerRewards.sort((a, b) =>
    a.data.name.localeCompare(b.data.name)
  );

  const handleDeleteReward = useCallback(
    (deleteId: string) => {
      // these are reward ids
      const rewardIndex = player.rewards.findIndex((id) => id === deleteId);
      const newRewards = [...player.rewards];
      newRewards.splice(rewardIndex, 1);
      const newPlayer = {
        ...player,
        rewards: newRewards,
      };
      handleModifyPlayer(newPlayer.id, newPlayer, "update");
      return newRewards;
    },
    [player, handleModifyPlayer]
  );

  return (
    <Accordion.Item eventKey={index.toString()}>
      <Accordion.Header style={{ fontFamily: "var(--bs-body-font-family)" }}>
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
          onClick={() => handleModifyPlayer(player.id, player, "delete")}
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
        <ListGroup.Item className={styles.playerReward} key={i}>
          <Button
            size="sm"
            variant="outline-danger"
            className="me-2 px-2"
            onClick={() => handleDeleteReward(id)}
          >
            &nbsp;x&nbsp;
          </Button>
          <SingleRewardText reward={data} oneLine={true} link={true} />
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
