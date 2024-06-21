import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc } from "../../types/reward-types";

interface AddOnFailTakeDamageProps {
  changeValue: ChangeValueFunc;
}

const AddOnFailTakeDamage: React.FC<AddOnFailTakeDamageProps> = ({
  changeValue,
}) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("onFailTakeDamage", 1)} />
      <AttributeDescription keyName="onFailTakeDamage" />
    </li>
  );
};

export default AddOnFailTakeDamage;
