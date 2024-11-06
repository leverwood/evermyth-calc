import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveTierDecreaseProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveTierDecrease: React.FC<RemoveTierDecreaseProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.tierDecrease) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("tierDecrease", -1)}
        overrideText={`❌ (current: ${selectedOptions.tierDecrease})`}
      />
      <AttributeDescription keyName="tierDecrease" />
    </li>
  );
};

export default RemoveTierDecrease;
