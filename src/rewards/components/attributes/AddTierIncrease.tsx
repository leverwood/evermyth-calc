import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddTierIncreaseAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddTierIncreaseAttribute: React.FC<AddTierIncreaseAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.tierIncrease) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("tierIncrease", 1)} />
      <AttributeDescription keyName="tierIncrease" />
    </li>
  );
};

export default AddTierIncreaseAttribute;
