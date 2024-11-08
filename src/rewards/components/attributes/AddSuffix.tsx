import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface AddSuffixAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddSuffixAttribute: React.FC<AddSuffixAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.suffix !== undefined) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("suffix", "")} />
      <AttributeDescription keyName="suffix" />
    </li>
  );
};

export default AddSuffixAttribute;
