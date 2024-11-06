import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData, STAGE } from "../../types/reward-types";
import { REWARD_STAGE_LIMITS } from "../../util/reward-stage-limits";

interface AddReduceDamageAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddReduceDamageAttribute: React.FC<AddReduceDamageAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (
    REWARD_STAGE_LIMITS["reduceDamage"][
      selectedOptions.stage || STAGE.ACTION
    ] === false
  ) {
    return null;
  }
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("reduceDamage", 1)} />
      <AttributeDescription keyName="reduceDamage" />
    </li>
  );
};

export default AddReduceDamageAttribute;
