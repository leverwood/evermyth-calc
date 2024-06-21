import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddWhileDefendingAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddWhileDefendingAttribute: React.FC<AddWhileDefendingAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.whileDefending) return null;

  return (
    <li>
      <AddRemoveButton
        size="sm"
        onClick={() => changeValue("whileDefending", true)}
      />
      <AttributeDescription keyName="whileDefending" />
    </li>
  );
};

export default AddWhileDefendingAttribute;
