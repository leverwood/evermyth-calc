import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddAvoidAlliesAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddAvoidAlliesAttribute: React.FC<AddAvoidAlliesAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (!selectedOptions.aoe) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("avoidAllies", true)} />
      <AttributeDescription keyName="avoidAllies" />
    </li>
  );
};

export default AddAvoidAlliesAttribute;
