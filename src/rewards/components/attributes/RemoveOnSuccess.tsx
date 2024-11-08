import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveOnSuccessProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveOnSuccess: React.FC<RemoveOnSuccessProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.onSuccess) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("onSuccess", false)}
      />
      <AttributeDescription keyName="onSuccess" />
    </li>
  );
};

export default RemoveOnSuccess;
