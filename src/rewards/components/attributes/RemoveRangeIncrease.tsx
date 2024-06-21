import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveRangeIncreaseProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveRangeIncrease: React.FC<RemoveRangeIncreaseProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.rangeIncrease) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        onClick={() => changeValue("rangeIncrease", -1)}
        adding={false}
      />
      <AttributeDescription keyName="rangeIncrease" />
    </li>
  );
};

export default RemoveRangeIncrease;
