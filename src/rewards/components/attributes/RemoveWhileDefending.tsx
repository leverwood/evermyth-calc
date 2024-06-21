import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveWhileDefendingProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveWhileDefending: React.FC<RemoveWhileDefendingProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.whileDefending) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("whileDefending", false)}
      />
      <AttributeDescription keyName="whileDefending" />
    </li>
  );
};

export default RemoveWhileDefending;
