import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc } from "../../types/reward-types";

interface AddLingeringDamageAttributeProps {
  changeValue: ChangeValueFunc;
}

const AddLingeringDamageAttribute: React.FC<
  AddLingeringDamageAttributeProps
> = ({ changeValue }) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("lingeringDamage", 1)} />
      <AttributeDescription keyName="lingeringDamage" />
    </li>
  );
};

export default AddLingeringDamageAttribute;
