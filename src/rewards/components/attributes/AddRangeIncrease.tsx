import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddRangeIncreaseAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddRangeIncreaseAttribute: React.FC<AddRangeIncreaseAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (!selectedOptions.ranged) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("rangeIncrease", 1)} />
      <AttributeDescription keyName="rangeIncrease" />
    </li>
  );
};

export default AddRangeIncreaseAttribute;
