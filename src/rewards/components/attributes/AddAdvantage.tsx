import React from "react";
import { Form } from "react-bootstrap";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddAdvantageAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddAdvantageAttribute: React.FC<AddAdvantageAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.advantage) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("advantage", true)} />
      <AttributeDescription keyName="advantage" />
      <Form.Control
        value={selectedOptions.advantageMsg || ""}
        type="text"
        onChange={(e) => changeValue("advantageMsg", e.target.value)}
      />
    </li>
  );
};

export default AddAdvantageAttribute;
