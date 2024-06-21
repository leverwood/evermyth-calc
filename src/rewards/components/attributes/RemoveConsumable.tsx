import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveConsumableProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveConsumable: React.FC<RemoveConsumableProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.consumable) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("consumable", false)}
      />
      <AttributeDescription keyName="consumable" />
    </li>
  );
};

export default RemoveConsumable;
