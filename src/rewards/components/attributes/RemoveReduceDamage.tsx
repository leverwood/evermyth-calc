import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveReduceDamageProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveReduceDamage: React.FC<RemoveReduceDamageProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.reduceDamage) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        onClick={() => changeValue("reduceDamage", -1)}
        adding={false}
      />
      <AttributeDescription keyName="reduceDamage" />
    </li>
  );
};

export default RemoveReduceDamage;
