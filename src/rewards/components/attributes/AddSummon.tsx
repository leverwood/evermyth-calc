import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddSummonAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddSummonAttribute: React.FC<AddSummonAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.summon) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("summon", true)} />
      <AttributeDescription keyName="summon" />
    </li>
  );
};

export default AddSummonAttribute;
