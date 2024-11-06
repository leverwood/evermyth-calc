import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveVulnerableProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
  index: number;
}

const RemoveVulnerable: React.FC<RemoveVulnerableProps> = ({
  selectedOptions,
  changeValue,
  className,
  index,
}) => {
  if (!selectedOptions.vulnerable || !selectedOptions.vulnerable.length)
    return null;

  return (
    <li className={className} data-index={index}>
      <AddRemoveButton
        onClick={() => changeValue("vulnerable", undefined, index)}
        adding={false}
        overrideText={`❌ (current)`}
      />
      <AttributeDescription keyName="vulnerable" />
      <input
        value={selectedOptions.vulnerable[index] || ""}
        type="text"
        onChange={(e) => changeValue("vulnerable", e.target.value, index)}
      />
    </li>
  );
};

export default RemoveVulnerable;
