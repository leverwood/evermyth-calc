import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveResistantProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
  index: number;
}

const RemoveResistant: React.FC<RemoveResistantProps> = ({
  selectedOptions,
  changeValue,
  className,
  index,
}) => {
  if (!selectedOptions.resistant || !selectedOptions.resistant.length)
    return null;

  return (
    <li className={className} data-index={index}>
      <AddRemoveButton
        onClick={() => changeValue("resistant", undefined, index)}
        adding={false}
        overrideText={`❌ (current)`}
      />
      <AttributeDescription keyName="resistant" />
      <input
        value={selectedOptions.resistant[index] || ""}
        type="text"
        onChange={(e) => changeValue("resistant", e.target.value, index)}
      />
    </li>
  );
};

export default RemoveResistant;
