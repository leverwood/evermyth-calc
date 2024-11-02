import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import {
  ChangeValueFunc,
  REWARD_TYPE,
  RewardData,
} from "../../types/reward-types";
import styles from "./../AddAttributes.module.scss";
import { initReward } from "../../util/reward-calcs";

interface AddUpcastAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  rewards: RewardData[];
  upcastRewardIndex: number;
  setUpcastReward: React.Dispatch<React.SetStateAction<number>>;
}

const AddUpcastAttribute: React.FC<AddUpcastAttributeProps> = ({
  selectedOptions,
  changeValue,
  rewards,
  upcastRewardIndex,
  setUpcastReward,
}) => {
  if (selectedOptions.upcast) return null;
  const upcastRewards = rewards
    .map((rewardData, i) => {
      return {
        rewardIndex: i,
        rewardData,
      };
    })
    .filter(({ rewardData }) => {
      const reward = initReward(rewardData);
      return reward.tier === -1 && reward.type === REWARD_TYPE.FEATURE;
    })
    .sort((a, b) =>
      (a.rewardData.name || "").localeCompare(b.rewardData.name || "")
    );

  return (
    <li>
      <AddRemoveButton
        onClick={() => changeValue("upcast", rewards[upcastRewardIndex])}
      />
      <AttributeDescription keyName="upcast" />
      <select
        className={styles.select}
        value={upcastRewardIndex}
        onChange={(e) => setUpcastReward(parseInt(e.target.value))}
      >
        <option value={-1}>Select a reward</option>
        {upcastRewards.map(({ rewardData, rewardIndex }) => (
          <option key={rewardIndex} value={rewardIndex}>
            {rewardData.name}
          </option>
        ))}
      </select>
    </li>
  );
};

export default AddUpcastAttribute;
