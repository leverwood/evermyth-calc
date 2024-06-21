import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddNoActionAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddNoActionAttribute: React.FC<AddNoActionAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.noAction) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("noAction", true)} />
      <AttributeDescription keyName="noAction" />
    </li>
  );
};

export default AddNoActionAttribute;
