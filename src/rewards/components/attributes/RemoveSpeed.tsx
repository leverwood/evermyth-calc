import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveSpeedProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveSpeed: React.FC<RemoveSpeedProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.speed) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        onClick={() => changeValue("speed", -1)}
        adding={false}
      />
      <AttributeDescription keyName="speed" />
    </li>
  );
};

export default RemoveSpeed;
