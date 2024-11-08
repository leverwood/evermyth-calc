import React from "react";
import { Form } from "react-bootstrap";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData, STAGE } from "../../types/reward-types";
import { REWARD_STAGE_LIMITS } from "../../util/reward-stage-limits";

interface AddAdvantageAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddAdvantageAttribute: React.FC<AddAdvantageAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.advantage) return null;
  if (
    REWARD_STAGE_LIMITS["advantage"][selectedOptions.stage || STAGE.ACTION] ===
    false
  ) {
    return null;
  }

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("advantage", true)} />
      <AttributeDescription keyName="advantage" />
      <Form.Control
        as="textarea"
        value={selectedOptions.advantageMsg || ""}
        type="text"
        onChange={(e) => changeValue("advantageMsg", e.target.value)}
      />
    </li>
  );
};

export default AddAdvantageAttribute;
