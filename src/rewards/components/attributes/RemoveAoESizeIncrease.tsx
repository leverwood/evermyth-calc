import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveAoeSizeIncreaseProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveAoeSizeIncrease: React.FC<RemoveAoeSizeIncreaseProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.aoeSizeIncrease) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        onClick={() => changeValue("aoeSizeIncrease", -1)}
        adding={false}
        overrideText={`❌ (current: ${selectedOptions.aoeSizeIncrease})`}
      />
      <AttributeDescription keyName="aoeSizeIncrease" />
    </li>
  );
};

export default RemoveAoeSizeIncrease;
