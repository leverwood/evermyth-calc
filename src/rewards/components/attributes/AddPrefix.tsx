import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface AddPrefixAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddPrefixAttribute: React.FC<AddPrefixAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.prefix !== undefined) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("prefix", "")} />
      <AttributeDescription keyName="prefix" />
    </li>
  );
};

export default AddPrefixAttribute;
