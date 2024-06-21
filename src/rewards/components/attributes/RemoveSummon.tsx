import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveSummonProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveSummon: React.FC<RemoveSummonProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.summon) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("summon", false)}
      />
      <AttributeDescription keyName="summon" />
    </li>
  );
};

export default RemoveSummon;
