import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddRequiresAmmoAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddRequiresAmmoAttribute: React.FC<AddRequiresAmmoAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.requiresAmmo) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("requiresAmmo", true)} />
      <AttributeDescription keyName="requiresAmmo" />
    </li>
  );
};

export default AddRequiresAmmoAttribute;
