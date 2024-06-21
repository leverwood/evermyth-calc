import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc } from "../../types/reward-types";

interface AddDealsAttributeProps {
  changeValue: ChangeValueFunc;
}

const AddDealsAttribute: React.FC<AddDealsAttributeProps> = ({
  changeValue,
}) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("deals", 1)} />
      <AttributeDescription keyName="deals" />
    </li>
  );
};

export default AddDealsAttribute;
