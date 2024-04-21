import styles from "./RewardCreator.module.scss";
import { initReward } from "../../util/reward-calcs";
import { RewardOptions } from "../../types/reward-types";
import TierRangeSlider from "./TierRangeSlider";
import { SingleRewardText } from "./SingleRewardText";

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
  // grab all the rewards but the last one
  const showRewards = savedRewards
    .slice(0, savedRewards.length - 1)
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
      <TierRangeSlider min={0} max={5} />
      <ul className={styles.rewardList}>
        {showRewards.map((options) => {
          const reward = initReward(options);
          const index = savedRewards.findIndex((opt) => opt === options);
          return (
            <li key={index}>
              <button
                className={styles.button}
                onClick={() => handleClickLoad(index)}
              >
                Load
              </button>
              <button
                className={styles.button}
                onClick={() => handleClickCopy(index)}
              >
                Copy
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleClickDelete(index)}
              >
                Delete
              </button>
              <SingleRewardText
                reward={reward}
                className={styles.rewardListText}
                oneLine={true}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
