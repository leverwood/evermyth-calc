import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
import { Form } from "react-bootstrap";

interface AddCurseAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddCurseAttribute: React.FC<AddCurseAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("curse", 1)} />
      <AttributeDescription keyName="curse" />
      <Form.Control
        as="textarea"
        value={selectedOptions.curseMsg || ""}
        onChange={(e) => changeValue("curseMsg", e.target.value)}
      />
    </li>
  );
};

export default AddCurseAttribute;
