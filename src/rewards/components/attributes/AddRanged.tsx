import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddRangedAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddRangedAttribute: React.FC<AddRangedAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.ranged) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("ranged", true)} />
      <AttributeDescription keyName="ranged" />
    </li>
  );
};

export default AddRangedAttribute;
