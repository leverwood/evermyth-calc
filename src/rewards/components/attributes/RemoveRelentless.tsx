import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveRelentlessProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveRelentless: React.FC<RemoveRelentlessProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.relentless) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("relentless", false)}
      />
      <AttributeDescription keyName="relentless" />
      <input
        value={selectedOptions.relentlessMsg || ""}
        onChange={(e) => changeValue("relentlessMsg", e.target.value)}
      />
    </li>
  );
};

export default RemoveRelentless;
