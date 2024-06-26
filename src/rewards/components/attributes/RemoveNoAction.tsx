import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveNoActionProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveNoAction: React.FC<RemoveNoActionProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.noAction) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("noAction", false)}
      />
      <AttributeDescription keyName="noAction" />
    </li>
  );
};

export default RemoveNoAction;
