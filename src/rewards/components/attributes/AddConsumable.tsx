import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddConsumableAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddConsumableAttribute: React.FC<AddConsumableAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.consumable) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("consumable", true)} />
      <AttributeDescription keyName="consumable" />
    </li>
  );
};

export default AddConsumableAttribute;
