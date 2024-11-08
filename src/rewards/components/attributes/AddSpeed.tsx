import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
import { Form } from "react-bootstrap";

interface AddSpeedAttributeProps {
  changeValue: ChangeValueFunc;
  selectedOptions: RewardData;
}

const AddSpeedAttribute: React.FC<AddSpeedAttributeProps> = ({
  changeValue,
  selectedOptions,
}) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("speed", 1)} />
      <AttributeDescription keyName="speed" />
      <Form.Control
        type="text"
        value={selectedOptions.speedType}
        onChange={(e) => changeValue("speedType", e.target.value)}
      />
    </li>
  );
};

export default AddSpeedAttribute;
