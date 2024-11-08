import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
import { Form } from "react-bootstrap";
interface RemovePrefixProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemovePrefix: React.FC<RemovePrefixProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (selectedOptions.prefix === undefined) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("prefix", undefined)}
      />
      <AttributeDescription keyName="prefix" />
      <Form.Control
        as="textarea"
        value={selectedOptions.prefix || ""}
        onChange={(e) => changeValue("prefix", e.target.value)}
      />
    </li>
  );
};

export default RemovePrefix;
