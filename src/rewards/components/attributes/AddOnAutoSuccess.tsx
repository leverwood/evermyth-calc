import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddOnAutoSuccessAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddOnAutoSuccessAttribute: React.FC<AddOnAutoSuccessAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.onAutoSuccess || selectedOptions.onSuccess) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("onAutoSuccess", true)} />
      <AttributeDescription keyName="onAutoSuccess" />
    </li>
  );
};

export default AddOnAutoSuccessAttribute;
