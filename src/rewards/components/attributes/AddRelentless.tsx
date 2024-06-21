import React from "react";
import { Form } from "react-bootstrap";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddRelentlessAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddRelentlessAttribute: React.FC<AddRelentlessAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.relentless) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("relentless", true)} />
      <AttributeDescription keyName="relentless" />
      <Form.Control
        value={selectedOptions.relentlessMsg || ""}
        type="text"
        onChange={(e) => changeValue("relentlessMsg", e.target.value)}
      />
    </li>
  );
};

export default AddRelentlessAttribute;
