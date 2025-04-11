import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc } from "../../types/reward-types";

interface AddReduceMaxPoolAttributeProps {
  changeValue: ChangeValueFunc;
}

const AddReduceMaxPoolAttribute: React.FC<AddReduceMaxPoolAttributeProps> = ({
  changeValue,
}) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("reduceMaxPool", 1)} />
      <AttributeDescription keyName="reduceMaxPool" />
    </li>
  );
};

export default AddReduceMaxPoolAttribute;
