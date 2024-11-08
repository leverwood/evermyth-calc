import React from "react";
import { Form } from "react-bootstrap";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddSpecificAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddSpecificAttribute: React.FC<AddSpecificAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.specific) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("specific", true)} />
      <AttributeDescription keyName="specific" />
      <Form.Control
        as="textarea"
        value={selectedOptions.specificMsg || ""}
        onChange={(e) => changeValue("specificMsg", e.target.value)}
      />
    </li>
  );
};

export default AddSpecificAttribute;
