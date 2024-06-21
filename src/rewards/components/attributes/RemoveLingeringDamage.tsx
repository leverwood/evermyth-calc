import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
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
        overrideText={`❌ (current: ${selectedOptions.lingeringDamage})`}
      />
      <AttributeDescription keyName="lingeringDamage" />
    </li>
  );
};

export default RemoveLingeringDamage;
