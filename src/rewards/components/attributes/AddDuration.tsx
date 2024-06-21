import React from "react";
import { Form } from "react-bootstrap";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddDurationAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddDurationAttribute: React.FC<AddDurationAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("duration", 1)} />
      <AttributeDescription keyName="duration" />
      <Form.Control
        value={selectedOptions.durationMsg || ""}
        type="text"
        onChange={(e) => changeValue("durationMsg", e.target.value)}
      />
    </li>
  );
};

export default AddDurationAttribute;
