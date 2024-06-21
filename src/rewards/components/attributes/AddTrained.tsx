import React from "react";
import { Form } from "react-bootstrap";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddTrainedAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddTrainedAttribute: React.FC<AddTrainedAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.trained) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("trained", true)} />
      <AttributeDescription keyName="trained" />
      <Form.Control
        value={selectedOptions.trainedMsg || ""}
        type="text"
        onChange={(e) => changeValue("trainedMsg", e.target.value)}
      />
    </li>
  );
};

export default AddTrainedAttribute;
