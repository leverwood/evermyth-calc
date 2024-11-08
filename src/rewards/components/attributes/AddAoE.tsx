import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData, STAGE } from "../../types/reward-types";
import { REWARD_STAGE_LIMITS } from "../../util/reward-stage-limits";

interface AddAoeAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddAoeAttribute: React.FC<AddAoeAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.aoe) return null;
  if (
    REWARD_STAGE_LIMITS["aoe"][selectedOptions.stage || STAGE.CHECK] === false
  ) {
    return null;
  }

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("aoe", true)} />
      <AttributeDescription keyName="aoe" />
    </li>
  );
};

export default AddAoeAttribute;
