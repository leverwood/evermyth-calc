import React, { useState } from "react";
import { Form } from "react-bootstrap";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc } from "../../types/reward-types";

interface AddResistantAttributeProps {
  changeValue: ChangeValueFunc;
  index: number;
}

const AddResistantAttribute: React.FC<AddResistantAttributeProps> = ({
  changeValue,
  index,
}) => {
  const [msg, setMsg] = useState("");
  return (
    <li data-index={`resistant-${index}`}>
      <AddRemoveButton
        onClick={() => {
          changeValue("resistant", msg, index);
          setMsg("");
        }}
      />
      <AttributeDescription keyName="resistant" />
      <Form.Control
        value={msg}
        type="text"
        onChange={(e) => setMsg(e.target.value)}
      />
    </li>
  );
};

export default AddResistantAttribute;
