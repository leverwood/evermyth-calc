import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
import { Form } from "react-bootstrap";
interface RemoveFlavorProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveFlavor: React.FC<RemoveFlavorProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (selectedOptions.flavor === undefined) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("flavor", undefined)}
      />
      <AttributeDescription keyName="flavor" />
      <Form.Control
        as="textarea"
        value={selectedOptions.flavor || ""}
        onChange={(e) => changeValue("flavor", e.target.value)}
      />
    </li>
  );
};

export default RemoveFlavor;
