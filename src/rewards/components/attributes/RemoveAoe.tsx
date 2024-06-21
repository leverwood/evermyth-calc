import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface RemoveAoeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveAoe: React.FC<RemoveAoeProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.aoe) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("aoe", false)}
      />
      <AttributeDescription keyName="aoe" />
    </li>
  );
};

export default RemoveAoe;
