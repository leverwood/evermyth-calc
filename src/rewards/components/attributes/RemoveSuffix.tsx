import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
import { Form } from "react-bootstrap";
interface RemoveSuffixProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveSuffix: React.FC<RemoveSuffixProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (selectedOptions.suffix === undefined) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("suffix", undefined)}
      />
      <AttributeDescription keyName="suffix" />
      <Form.Control
        as="textarea"
        value={selectedOptions.suffix || ""}
        onChange={(e) => changeValue("suffix", e.target.value)}
      />
    </li>
  );
};

export default RemoveSuffix;
