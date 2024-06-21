import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveStunnedProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveStunned: React.FC<RemoveStunnedProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.stunned) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("stunned", false)}
      />
      <AttributeDescription keyName="stunned" />
    </li>
  );
};

export default RemoveStunned;
