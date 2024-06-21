import React from "react";
import { Form } from "react-bootstrap";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddDisadvantageAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddDisadvantageAttribute: React.FC<AddDisadvantageAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.disadvantage) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("disadvantage", true)} />
      <AttributeDescription keyName="disadvantage" />
      <Form.Control
        value={selectedOptions.disadvantageMsg || ""}
        type="text"
        onChange={(e) => changeValue("disadvantageMsg", e.target.value)}
      />
    </li>
  );
};

export default AddDisadvantageAttribute;
