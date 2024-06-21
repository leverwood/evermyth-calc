import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddRestrainedAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddRestrainedAttribute: React.FC<AddRestrainedAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.restrained) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("restrained", true)} />
      <AttributeDescription keyName="restrained" />
    </li>
  );
};

export default AddRestrainedAttribute;
