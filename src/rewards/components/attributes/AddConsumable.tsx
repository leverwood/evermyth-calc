import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import {
  ChangeValueFunc,
  REWARD_TYPE,
  RewardData,
} from "../../types/reward-types";

interface AddConsumableAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddConsumableAttribute: React.FC<AddConsumableAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (
    selectedOptions.consumable ||
    selectedOptions.type === REWARD_TYPE.FEATURE
  )
    return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("consumable", true)} />
      <AttributeDescription keyName="consumable" />
    </li>
  );
};

export default AddConsumableAttribute;
