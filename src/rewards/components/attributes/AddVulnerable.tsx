import React, { useState } from "react";
import { Form } from "react-bootstrap";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc } from "../../types/reward-types";

interface AddVulnerableAttributeProps {
  changeValue: ChangeValueFunc;
  index: number;
}

const AddVulnerableAttribute: React.FC<AddVulnerableAttributeProps> = ({
  changeValue,
  index,
}) => {
  const [msg, setMsg] = useState("");
  return (
    <li data-index={`vulnerable-${index}`}>
      <AddRemoveButton
        onClick={() => {
          changeValue("vulnerable", msg, index);
          setMsg("");
        }}
      />
      <AttributeDescription keyName="vulnerable" />
      <Form.Control
        value={msg}
        type="text"
        onChange={(e) => setMsg(e.target.value)}
      />
    </li>
  );
};

export default AddVulnerableAttribute;
