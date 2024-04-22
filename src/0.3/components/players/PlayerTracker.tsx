import { useCallback, useState } from "react";
import { Button, Accordion, Form, ListGroup } from "react-bootstrap";

import { SavedPCData } from "../../types/system-types";
import styles from "./PlayerTracker.module.scss";
import { getRewardOptionsFromIds, initReward } from "../../util/reward-calcs";
import { getPCLearnedFeatures, getPCWellspring } from "../../util/pc-calcs";
import { SingleRewardText } from "../rewards/SingleRewardText";
import { RewardOptions } from "../../types/reward-types";
import { getRewardsFromStorage } from "../../util/reward-make";
import { PlayerBasicInfo } from "./PlayerBasicInfo";
import AddReward from "./AddReward";
import { HandleModifyPlayerFunc } from "../../types/pc-types";

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
}: {
  players: SavedPCData[];
  handleModifyPlayer: HandleModifyPlayerFunc;
  rewards: RewardOptions[];
}) {
  return (
    <div>
      <Accordion defaultActiveKey="0">
        {players.map((player, i) => (
          <Player
            player={player}
            key={player.name}
            index={i}
            handleModifyPlayer={handleModifyPlayer}
            rewards={rewards}
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
}: {
  player: SavedPCData;
  index: number;
  handleModifyPlayer: HandleModifyPlayerFunc;
  rewards: RewardOptions[];
}) {
  const playerRewards = getRewardOptionsFromIds(player.rewards, rewards);

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
    <Accordion.Item eventKey={index.toString()}>
      <Accordion.Header>
        <strong>{player.name}&nbsp;</strong> | Can learn{" "}
        {getPCLearnedFeatures(player)} features | Wellspring{" "}
        {getPCWellspring(player.level)}
      </Accordion.Header>
      <Accordion.Body>
        <PlayerBasicInfo {...{ index, handleModifyPlayer, player }} />
        <AddReward
          {...{ index, playerRewards, rewards, handleModifyPlayer, player }}
        />
        <ListGroup className={`mb-4`} variant="flush">
          {playerRewards.map((opt, i) => {
            const reward = initReward(opt);
            return (
              <ListGroup.Item className={styles.playerReward} key={i}>
                <Button
                  size="sm"
                  variant="outline-danger"
                  className="me-2 px-2"
                  onClick={() => handleDeleteReward(i)}
                >
                  &nbsp;x&nbsp;
                </Button>
                <SingleRewardText reward={reward} oneLine={true} />
              </ListGroup.Item>
            );
          })}
        </ListGroup>
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
