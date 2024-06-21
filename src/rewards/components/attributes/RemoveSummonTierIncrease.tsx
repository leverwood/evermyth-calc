import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
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
        overrideText={`❌ (current: ${selectedOptions.summonTierIncrease})`}
      />
      <AttributeDescription keyName="summonTierIncrease" />
    </li>
  );
};

export default RemoveSummonTierIncrease;
