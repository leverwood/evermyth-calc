import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveNoCheckProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveNoCheck: React.FC<RemoveNoCheckProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.noCheck) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("noCheck", false)}
      />
      <AttributeDescription keyName="noCheck" />
    </li>
  );
};

export default RemoveNoCheck;
