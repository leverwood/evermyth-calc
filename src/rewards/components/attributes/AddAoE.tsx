import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddAoeAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddAoeAttribute: React.FC<AddAoeAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.aoe) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("aoe", true)} />
      <AttributeDescription keyName="aoe" />
    </li>
  );
};

export default AddAoeAttribute;
