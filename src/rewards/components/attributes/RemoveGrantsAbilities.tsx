import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
import { Form } from "react-bootstrap";

interface RemoveGrantsAbilitiesProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveGrantsAbilities: React.FC<RemoveGrantsAbilitiesProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (
    !selectedOptions.grantsAbilities ||
    !selectedOptions.grantsAbilities.length
  )
    return null;

  return (
    <>
      {selectedOptions.grantsAbilities.map((ability, i) => (
        <li key={i} className={className}>
          <AddRemoveButton
            adding={false}
            onClick={() => changeValue("deleteAbility", ability, i)}
          />
          <AttributeDescription keyName="grantsAbilities" />
          <Form.Control
            as="textarea"
            value={ability}
            onChange={(e) => changeValue("changeAbility", e.target.value, i)}
          />
        </li>
      ))}
    </>
  );
};

export default RemoveGrantsAbilities;
