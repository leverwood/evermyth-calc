import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddRangeDecreaseAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddRangeDecreaseAttribute: React.FC<AddRangeDecreaseAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (
    !selectedOptions.ranged ||
    selectedOptions.rangeIncrease ||
    selectedOptions.rangeDecrease
  )
    return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("rangeDecrease", true)} />
      <AttributeDescription keyName="rangeDecrease" />
    </li>
  );
};

export default AddRangeDecreaseAttribute;
