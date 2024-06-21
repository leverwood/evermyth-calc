import React from "react";
import { Form } from "react-bootstrap";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddCastTimeAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddCastTimeAttribute: React.FC<AddCastTimeAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("castTime", 1)} />
      <AttributeDescription keyName="castTime" />
      <Form.Control
        value={selectedOptions.castTimeMsg || ""}
        type="text"
        onChange={(e) => changeValue("castTimeMsg", e.target.value)}
      />
    </li>
  );
};

export default AddCastTimeAttribute;
