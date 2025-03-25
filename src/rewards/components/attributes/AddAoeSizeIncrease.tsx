import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddAoeSizeIncreaseAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddAoeSizeIncreaseAttribute: React.FC<AddAoeSizeIncreaseAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (!selectedOptions.aoe) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("aoeSizeIncrease", 1)} />
      <AttributeDescription keyName="aoeSizeIncrease" />
    </li>
  );
};

export default AddAoeSizeIncreaseAttribute;
