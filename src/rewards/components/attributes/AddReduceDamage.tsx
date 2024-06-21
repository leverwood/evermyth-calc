import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc } from "../../types/reward-types";

interface AddReduceDamageAttributeProps {
  changeValue: ChangeValueFunc;
}

const AddReduceDamageAttribute: React.FC<AddReduceDamageAttributeProps> = ({
  changeValue,
}) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("reduceDamage", 1)} />
      <AttributeDescription keyName="reduceDamage" />
    </li>
  );
};

export default AddReduceDamageAttribute;
