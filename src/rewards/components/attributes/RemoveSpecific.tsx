import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
import { Form } from "react-bootstrap";
interface RemoveSpecificProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveSpecific: React.FC<RemoveSpecificProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.specific) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("specific", false)}
      />
      <AttributeDescription keyName="specific" />
      <Form.Control
        as="textarea"
        value={selectedOptions.specificMsg || ""}
        onChange={(e) => changeValue("specificMsg", e.target.value)}
      />
    </li>
  );
};

export default RemoveSpecific;
