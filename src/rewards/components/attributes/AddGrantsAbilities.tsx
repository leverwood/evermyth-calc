import React from "react";
import { Form } from "react-bootstrap";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc } from "../../types/reward-types";

interface AddGrantsAbilitiesAttributeProps {
  newAbility: string;
  setNewAbility: React.Dispatch<React.SetStateAction<string>>;
  changeValue: ChangeValueFunc;
}

const AddGrantsAbilitiesAttribute: React.FC<
  AddGrantsAbilitiesAttributeProps
> = ({ newAbility, setNewAbility, changeValue }) => {
  return (
    <li>
      <AddRemoveButton
        onClick={() => {
          changeValue("addAbility", newAbility);
          setNewAbility("");
        }}
      />
      <AttributeDescription keyName="grantsAbilities" />
      <Form.Control
        as="textarea"
        value={newAbility}
        type="text"
        onChange={(e) => setNewAbility(e.target.value)}
      />
    </li>
  );
};

export default AddGrantsAbilitiesAttribute;
