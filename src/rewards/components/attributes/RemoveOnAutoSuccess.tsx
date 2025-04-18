import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveOnAutoSuccessProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveOnAutoSuccess: React.FC<RemoveOnAutoSuccessProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.onAutoSuccess) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("onAutoSuccess", false)}
      />
      <AttributeDescription keyName="onAutoSuccess" />
    </li>
  );
};

export default RemoveOnAutoSuccess;
