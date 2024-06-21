import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddTeleportAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddTeleportAttribute: React.FC<AddTeleportAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.teleport) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("teleport", true)} />
      <AttributeDescription keyName="teleport" />
    </li>
  );
};

export default AddTeleportAttribute;
