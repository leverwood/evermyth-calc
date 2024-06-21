import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc } from "../../types/reward-types";

interface AddHealsAttributeProps {
  changeValue: ChangeValueFunc;
}

const AddHealsAttribute: React.FC<AddHealsAttributeProps> = ({
  changeValue,
}) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("heals", 1)} />
      <AttributeDescription keyName="heals" />
    </li>
  );
};

export default AddHealsAttribute;
