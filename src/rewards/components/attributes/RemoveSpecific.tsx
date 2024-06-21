import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveSpecificProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveSpecific: React.FC<RemoveSpecificProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.specific) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("specific", false)}
      />
      <AttributeDescription keyName="specific" />
      <input
        value={selectedOptions.specificMsg || ""}
        onChange={(e) => changeValue("specificMsg", e.target.value)}
      />
    </li>
  );
};

export default RemoveSpecific;
