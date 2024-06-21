import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveSummonTierIncreaseProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveSummonTierIncrease: React.FC<RemoveSummonTierIncreaseProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.summonTierIncrease) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        onClick={() => changeValue("summonTierIncrease", -1)}
        adding={false}
      />
      <AttributeDescription keyName="summonTierIncrease" />
    </li>
  );
};

export default RemoveSummonTierIncrease;
