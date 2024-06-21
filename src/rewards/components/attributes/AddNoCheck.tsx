import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddNoCheckAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddNoCheckAttribute: React.FC<AddNoCheckAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.noCheck || selectedOptions.noAction) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("noCheck", true)} />
      <AttributeDescription keyName="noCheck" />
    </li>
  );
};

export default AddNoCheckAttribute;
