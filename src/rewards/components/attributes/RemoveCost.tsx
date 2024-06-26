import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveCostProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveCost: React.FC<RemoveCostProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.cost) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("cost", -1)}
        overrideText={`❌ (current: ${selectedOptions.cost})`}
      />
      <AttributeDescription keyName="cost" />
    </li>
  );
};

export default RemoveCost;
