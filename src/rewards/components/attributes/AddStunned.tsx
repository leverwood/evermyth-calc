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
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("stunned", 1)} />
      <AttributeDescription keyName="stunned" />
    </li>
  );
};

export default AddStunnedAttribute;
