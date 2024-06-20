import { Button, Col, Form, Row } from "react-bootstrap";
import { useCallback, useState } from "react";
import Select from "react-select";

import { RewardData, RewardDataID } from "../../rewards/types/reward-types";
import { HandleModifyPlayerFunc, PlayerData } from "../types/pc-types";

export default function AddReward({
  index,
  playerRewards,
  rewards,
  handleModifyPlayer,
  player,
}: {
  index: number;
  playerRewards: RewardData[];
  rewards: RewardData[];
  handleModifyPlayer: HandleModifyPlayerFunc;
  player: PlayerData;
}) {
  const [selectedReward, setSelectedReward] = useState<RewardDataID>("-1");
  const options = rewards
    .map((reward) => {
      // omit rewards already added
      if (playerRewards.find((r) => r.id === reward.id)) return null;
      if (!reward.name || !reward.id) return null;
      return { value: reward.id || "", label: reward.name || "" };
    })
    .filter((r) => r) as { value: string; label: string }[];
  options.unshift({ value: "-1", label: "Select Reward" });

  const handleAddReward = useCallback(
    (rewardId: RewardDataID) => {
      if (rewardId === "-1") return;

      // don't add it if it's already there
      if (player.rewards.includes(rewardId)) return;

      const newPlayer = {
        ...player,
        rewards: [...player.rewards, rewardId],
      };
      handleModifyPlayer(player.id, newPlayer, "update");
      setSelectedReward("-1");
    },
    [player, handleModifyPlayer]
  );
  return (
    <Form as={Row} className={`mb-4`}>
      <Col>
        <Select
          options={options}
          onChange={(e) => (e ? setSelectedReward(e.value) : "")}
          value={options.find((o) => o.value === selectedReward) || options[0]}
        />
      </Col>
      <Col>
        {selectedReward !== "-1" && (
          <Button
            type="submit"
            variant="outline-success"
            onClick={() => handleAddReward(selectedReward)}
            disabled={options.length === 1 || selectedReward === "-1"}
          >
            Add
          </Button>
        )}
      </Col>
    </Form>
  );
}
