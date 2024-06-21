import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc } from "../../types/reward-types";

interface AddWellspringRecoverAttributeProps {
  changeValue: ChangeValueFunc;
}

const AddWellspringRecoverAttribute: React.FC<
  AddWellspringRecoverAttributeProps
> = ({ changeValue }) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("wellspringRecover", 1)} />
      <AttributeDescription keyName="wellspringRecover" />
    </li>
  );
};

export default AddWellspringRecoverAttribute;
