import { Button, Form, InputGroup, ListGroup } from "react-bootstrap";

import { initReward } from "../../util/reward-calcs";
import { RewardOptions } from "../../types/reward-types";
import TierRangeSlider from "./TierRangeSlider";
import { SingleRewardText } from "./SingleRewardText";
import styles from "./SavedRewards.module.scss";
import { useState } from "react";

const findMaxTier = (rewards: RewardOptions[]) => {
  let max = 0;
  rewards.forEach((reward) => {
    const r = initReward(reward);
    if (r.tier > max) max = r.tier;
  });
  return max;
};

export function SavedRewards({
  savedRewards,
  handleClickLoad,
  handleClickDelete,
  handleClickCopy,
}: {
  savedRewards: RewardOptions[];
  handleClickLoad: (index: number) => void;
  handleClickDelete: (index: number) => void;
  handleClickCopy: (index: number) => void;
}) {
  const globalMax = findMaxTier(savedRewards);
  const [shownTierRange, setShownTierRange] = useState<[number, number]>([
    0,
    globalMax,
  ]);
  const [searchText, setSearchText] = useState<string>("");

  // grab all the rewards but the last one
  const showRewards = savedRewards
    .slice(0, savedRewards.length - 1)
    .filter((options) =>
      options.name?.toLowerCase().includes(searchText.toLowerCase())
    )
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

  return (
    <div>
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
      <ListGroup className={styles.rewardList}>
        {showRewards.map((options) => {
          const reward = initReward(options);
          const index = savedRewards.findIndex((opt) => opt === options);
          return (
            <ListGroup.Item className={`d-flex`} key={index}>
              <p className={`flex-grow-1`}>
                <SingleRewardText reward={reward} oneLine={true} />
              </p>

              <div className={`flex-shrink-1 d-flex align-items-center`}>
                <Button
                  size="sm"
                  className="me-2"
                  onClick={() => handleClickLoad(index)}
                >
                  Load
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleClickCopy(index)}
                >
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleClickDelete(index)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
}
