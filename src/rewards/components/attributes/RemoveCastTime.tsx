import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
import { Form } from "react-bootstrap";
interface RemoveCastTimeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveCastTime: React.FC<RemoveCastTimeProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.castTime) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("castTime", -1)}
        overrideText={`❌ (current: ${selectedOptions.castTime})`}
      />
      <AttributeDescription keyName="castTime" />
      <Form.Control
        type="text"
        value={selectedOptions.castTimeMsg || ""}
        onChange={(e) => changeValue("castTimeMsg", e.target.value)}
      />
    </li>
  );
};

export default RemoveCastTime;
