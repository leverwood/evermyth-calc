import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveDisadvantageProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveDisadvantage: React.FC<RemoveDisadvantageProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.disadvantage) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("disadvantage", false)}
      />
      <AttributeDescription keyName="disadvantage" />
      <input
        value={selectedOptions.disadvantageMsg || ""}
        onChange={(e) => changeValue("disadvantageMsg", e.target.value)}
      />
    </li>
  );
};

export default RemoveDisadvantage;
