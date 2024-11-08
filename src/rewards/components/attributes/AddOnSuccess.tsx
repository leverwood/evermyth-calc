import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddOnSuccessAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddOnSuccessAttribute: React.FC<AddOnSuccessAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.onSuccess || selectedOptions.onAutoSuccess) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("onSuccess", true)} />
      <AttributeDescription keyName="onSuccess" />
    </li>
  );
};

export default AddOnSuccessAttribute;
