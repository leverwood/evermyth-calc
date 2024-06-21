import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc } from "../../types/reward-types";

interface AddWellspringMaxAttributeProps {
  changeValue: ChangeValueFunc;
}

const AddWellspringMaxAttribute: React.FC<AddWellspringMaxAttributeProps> = ({
  changeValue,
}) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("wellspringMax", 1)} />
      <AttributeDescription keyName="wellspringMax" />
    </li>
  );
};

export default AddWellspringMaxAttribute;
