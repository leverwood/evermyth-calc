import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveRangedProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveRanged: React.FC<RemoveRangedProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.ranged) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("ranged", false)}
      />
      <AttributeDescription keyName="ranged" />
    </li>
  );
};

export default RemoveRanged;
