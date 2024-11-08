import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
import { Form } from "react-bootstrap";
interface RemoveSummonProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveSummon: React.FC<RemoveSummonProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.summon) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("summon", false)}
      />
      <AttributeDescription keyName="summon" />
      <Form.Control
        type="text"
        value={selectedOptions.summonName}
        onChange={(e) => changeValue("summonName", e.target.value)}
      />
    </li>
  );
};

export default RemoveSummon;
