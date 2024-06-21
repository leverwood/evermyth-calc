import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddIsMoveAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddIsMoveAttribute: React.FC<AddIsMoveAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.isMove) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("isMove", true)} />
      <AttributeDescription keyName="isMove" />
    </li>
  );
};

export default AddIsMoveAttribute;
