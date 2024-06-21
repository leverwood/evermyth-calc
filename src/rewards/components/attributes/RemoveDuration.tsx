import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveDurationProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveDuration: React.FC<RemoveDurationProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.duration) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        onClick={() => changeValue("duration", -1)}
        adding={false}
        overrideText={`❌ (current: ${selectedOptions.duration})`}
      />
      <AttributeDescription keyName="duration" />
      <input
        value={selectedOptions.durationMsg || ""}
        onChange={(e) => changeValue("durationMsg", e.target.value)}
      />
    </li>
  );
};

export default RemoveDuration;
