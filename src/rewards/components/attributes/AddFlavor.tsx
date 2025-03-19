import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface AddFlavorAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddFlavorAttribute: React.FC<AddFlavorAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.flavor !== undefined) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("flavor", "")} />
      <AttributeDescription keyName="flavor" />
    </li>
  );
};

export default AddFlavorAttribute;
