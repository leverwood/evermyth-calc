import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddStunnedAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddStunnedAttribute: React.FC<AddStunnedAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.stunned) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("stunned", true)} />
      <AttributeDescription keyName="stunned" />
    </li>
  );
};

export default AddStunnedAttribute;
