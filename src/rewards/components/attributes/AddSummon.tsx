import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
import { Form } from "react-bootstrap";

interface AddSummonAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddSummonAttribute: React.FC<AddSummonAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.summon) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("summon", true)} />
      <AttributeDescription keyName="summon" />
      <Form.Control
        type="text"
        value={selectedOptions.summonName}
        onChange={(e) => changeValue("summonName", e.target.value)}
      />
    </li>
  );
};

export default AddSummonAttribute;
