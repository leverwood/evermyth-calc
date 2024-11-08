import React, { useState } from "react";
import { Form } from "react-bootstrap";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc } from "../../types/reward-types";

interface AddImposeVulnerableAttributeProps {
  changeValue: ChangeValueFunc;
  index: number;
}

const AddImposeVulnerableAttribute: React.FC<
  AddImposeVulnerableAttributeProps
> = ({ changeValue, index }) => {
  const [msg, setMsg] = useState("");
  return (
    <li data-index={`imposeVulnerable-${index}`}>
      <AddRemoveButton
        onClick={() => {
          changeValue("imposeVulnerable", msg, index);
          setMsg("");
        }}
      />
      <AttributeDescription keyName="imposeVulnerable" />
      <Form.Control
        value={msg}
        type="text"
        onChange={(e) => setMsg(e.target.value)}
      />
    </li>
  );
};

export default AddImposeVulnerableAttribute;