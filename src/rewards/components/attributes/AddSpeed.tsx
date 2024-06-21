import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc } from "../../types/reward-types";

interface AddSpeedAttributeProps {
  changeValue: ChangeValueFunc;
}

const AddSpeedAttribute: React.FC<AddSpeedAttributeProps> = ({
  changeValue,
}) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("speed", 1)} />
      <AttributeDescription keyName="speed" />
    </li>
  );
};

export default AddSpeedAttribute;
