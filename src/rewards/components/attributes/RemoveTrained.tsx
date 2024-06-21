import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveTrainedProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveTrained: React.FC<RemoveTrainedProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.trained) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("trained", false)}
      />
      <AttributeDescription keyName="trained" />
      <input
        value={selectedOptions.trainedMsg || ""}
        onChange={(e) => changeValue("trainedMsg", e.target.value)}
      />
    </li>
  );
};

export default RemoveTrained;
