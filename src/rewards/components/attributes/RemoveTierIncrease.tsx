import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveTierIncreaseProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveTierIncrease: React.FC<RemoveTierIncreaseProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.tierIncrease) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("tierIncrease", -1)}
        overrideText={`❌ (current: ${selectedOptions.tierIncrease})`}
      />
      <AttributeDescription keyName="tierIncrease" />
    </li>
  );
};

export default RemoveTierIncrease;
