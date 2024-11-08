import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
import { Form } from "react-bootstrap";
interface RemoveSpeedProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveSpeed: React.FC<RemoveSpeedProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.speed) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        onClick={() => changeValue("speed", -1)}
        adding={false}
        overrideText={`❌ (current: ${selectedOptions.speed})`}
      />
      <AttributeDescription keyName="speed" />
      <Form.Control
        type="text"
        value={selectedOptions.speedType}
        onChange={(e) => changeValue("speedType", e.target.value)}
      />
    </li>
  );
};

export default RemoveSpeed;
