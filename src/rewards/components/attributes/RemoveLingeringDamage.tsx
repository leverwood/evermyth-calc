import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveLingeringDamageProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveLingeringDamage: React.FC<RemoveLingeringDamageProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.lingeringDamage) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        onClick={() => changeValue("lingeringDamage", -1)}
        adding={false}
      />
      <AttributeDescription keyName="lingeringDamage" />
    </li>
  );
};

export default RemoveLingeringDamage;
