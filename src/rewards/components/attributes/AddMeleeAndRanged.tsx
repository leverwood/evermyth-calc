import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddMeleeAndRangedAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddMeleeAndRangedAttribute: React.FC<AddMeleeAndRangedAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.meleeAndRanged) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("meleeAndRanged", true)} />
      <AttributeDescription keyName="meleeAndRanged" />
    </li>
  );
};

export default AddMeleeAndRangedAttribute;
