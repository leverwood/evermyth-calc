import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddTierDecreaseAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddTierDecreaseAttribute: React.FC<AddTierDecreaseAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("tierDecrease", 1)} />
      <AttributeDescription keyName="tierDecrease" />
    </li>
  );
};

export default AddTierDecreaseAttribute;
