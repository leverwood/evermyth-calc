import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveAdvantageProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveAdvantage: React.FC<RemoveAdvantageProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.advantage) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("advantage", false)}
      />
      <AttributeDescription keyName="advantage" />
      <input
        value={selectedOptions.advantageMsg || ""}
        onChange={(e) => changeValue("advantageMsg", e.target.value)}
      />
    </li>
  );
};

export default RemoveAdvantage;
