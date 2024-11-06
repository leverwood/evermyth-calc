import React, { useState } from "react";
import { Form } from "react-bootstrap";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc } from "../../types/reward-types";

interface AddImmuneAttributeProps {
  changeValue: ChangeValueFunc;
  index: number;
}

const AddImmuneAttribute: React.FC<AddImmuneAttributeProps> = ({
  changeValue,
  index,
}) => {
  const [msg, setMsg] = useState("");
  return (
    <li data-index={`immune-${index}`}>
      <AddRemoveButton
        onClick={() => {
          changeValue("immune", msg, index);
          setMsg("");
        }}
      />
      <AttributeDescription keyName="immune" />
      <Form.Control
        value={msg}
        type="text"
        onChange={(e) => setMsg(e.target.value)}
      />
    </li>
  );
};

export default AddImmuneAttribute;
