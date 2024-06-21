import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc } from "../../types/reward-types";

interface AddCostAttributeProps {
  changeValue: ChangeValueFunc;
}

const AddCostAttribute: React.FC<AddCostAttributeProps> = ({ changeValue }) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("cost", 1)} />
      <AttributeDescription keyName="cost" />
    </li>
  );
};

export default AddCostAttribute;
