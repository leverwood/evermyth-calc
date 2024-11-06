import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveImposeVulnerableProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
  index: number;
}

const RemoveImposeVulnerable: React.FC<RemoveImposeVulnerableProps> = ({
  selectedOptions,
  changeValue,
  className,
  index,
}) => {
  if (
    !selectedOptions.imposeVulnerable ||
    !selectedOptions.imposeVulnerable.length
  )
    return null;

  return (
    <li className={className} data-index={index}>
      <AddRemoveButton
        onClick={() => changeValue("imposeVulnerable", undefined, index)}
        adding={false}
        overrideText={`❌ (current)`}
      />
      <AttributeDescription keyName="imposeVulnerable" />
      <input
        value={selectedOptions.imposeVulnerable[index] || ""}
        type="text"
        onChange={(e) => changeValue("imposeVulnerable", e.target.value, index)}
      />
    </li>
  );
};

export default RemoveImposeVulnerable;
