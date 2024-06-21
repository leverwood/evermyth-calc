import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
import styles from "./../AddAttributes.module.scss";

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
        {rewards.map((reward, i) => (
          <option key={i} value={i}>
            {reward.name}
          </option>
        ))}
      </select>
    </li>
  );
};

export default AddUpcastAttribute;
