import { useCallback } from "react";
import styles from "./RewardCreator.module.scss";
import { LOG_LEVEL, Logger } from "../../util/log";
import { useRewardContext } from "../contexts/RewardContext";
import { Button, Form, InputGroup, ListGroup } from "react-bootstrap";

import { initReward } from "../util/reward-calcs";
import { REWARD_TYPE, RewardData } from "../types/reward-types";
import TierRangeSlider from "./TierRangeSlider";
import { SingleRewardText } from "./SingleRewardText";
import { useState } from "react";

export const logger = Logger(LOG_LEVEL.INFO);

const findMaxTier = (rewards: RewardData[]) => {
  let max = 0;
  rewards.forEach((reward) => {
    const r = initReward(reward);
    if (r.tier > max) max = r.tier;
  });
  return max;
};

export default function RewardCreator() {
  const { rewards, addReward, deleteReward, getRewardById } =
    useRewardContext();

  const globalMax = findMaxTier(rewards);
  const [shownTierRange, setShownTierRange] = useState<[number, number]>([
    0,
    globalMax,
  ]);
  const [searchText, setSearchText] = useState<string>("");

  const handleClickCopy = useCallback(
    (id: string | undefined) => {
      logger.debug("----- handleClickCopy ------", id);
      if (!id) return;
      const rewardToCopy = getRewardById(id);
      const newRewardData = {
        ...rewardToCopy,
        name: rewardToCopy?.name + " Copy",
        id: undefined,
      };
      addReward(newRewardData);
    },
    [addReward, getRewardById]
  );

  // grab all the rewards but the last one
  const showRewards = rewards
    .slice(0, rewards.length - 1)
    .filter((options) =>
      options.name?.toLowerCase().includes(searchText.toLowerCase())
    )
    // filter rewards not in tier range
    .filter((options) => {
      const r = initReward(options);
      return r.tier >= shownTierRange[0] && r.tier <= shownTierRange[1];
    })
    .sort((opt1, opt2) => {
      const r1 = initReward(opt1);
      const r2 = initReward(opt2);
      if (r1.tier < 0) r1.tier = 0;
      if (r2.tier < 0) r2.tier = 0;
      return r1.tier === r2.tier
        ? r1.name.localeCompare(r2.name)
        : r1.tier - r2.tier;
    });

  const handleClickDelete = (id: string | undefined) => {
    if (id) deleteReward(id);
  };

  const handleCreateNew = () => {
    const id = addReward({ name: "", type: REWARD_TYPE.EQUIPMENT });
    // navigate to edit page
    window.location.href = `/rewards/${id}/edit`;
  };

  return (
    <div className={styles.root}>
      <h1>Reward Creator</h1>
      <TierRangeSlider
        value={shownTierRange}
        setShownTierRange={setShownTierRange}
        max={globalMax}
      />
      <InputGroup className="mb-4">
        <Form.Control
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search"
        ></Form.Control>
        <InputGroup.Text>🔎</InputGroup.Text>
      </InputGroup>
      <Button onClick={handleCreateNew} className="mb-4">
        Create New Reward
      </Button>
      <div className={styles.rewardList}>
        <ListGroup>
          {showRewards.map((options) => {
            const reward = initReward(options);
            const index = rewards.findIndex((opt) => opt === options);
            return (
              <ListGroup.Item className={`d-flex`} key={index}>
                <p className={`flex-grow-1`}>
                  <SingleRewardText reward={reward} oneLine={true} />
                </p>

                <div className={`flex-shrink-1 d-flex align-items-center`}>
                  <a href={`/rewards/${options.id}/edit`} className="me-2">
                    <Button size="sm" className="me-2">
                      Load
                    </Button>
                  </a>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleClickCopy(options.id)}
                  >
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleClickDelete(options.id)}
                  >
                    Delete
                  </Button>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>
    </div>
  );
}