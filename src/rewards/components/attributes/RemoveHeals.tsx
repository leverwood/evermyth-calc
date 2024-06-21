import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveHealsProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveHeals: React.FC<RemoveHealsProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.heals) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        onClick={() => changeValue("heals", -1)}
        adding={false}
        overrideText={`❌ (current: ${selectedOptions.heals})`}
      />
      <AttributeDescription keyName="heals" />
    </li>
  );
};

export default RemoveHeals;
