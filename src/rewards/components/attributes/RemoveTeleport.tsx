import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveTeleportProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveTeleport: React.FC<RemoveTeleportProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.teleport) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("teleport", false)}
      />
      <AttributeDescription keyName="teleport" />
    </li>
  );
};

export default RemoveTeleport;
