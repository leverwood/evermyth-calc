import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
import { Form } from "react-bootstrap";
interface RemoveCurseProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveCurse: React.FC<RemoveCurseProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.curse) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("curse", -1)}
        overrideText={`❌ (current: ${selectedOptions.curse})`}
      />
      <AttributeDescription keyName="curse" />
      <Form.Control
        as="textarea"
        value={selectedOptions.curseMsg || ""}
        onChange={(e) => changeValue("curseMsg", e.target.value)}
      />
    </li>
  );
};

export default RemoveCurse;
