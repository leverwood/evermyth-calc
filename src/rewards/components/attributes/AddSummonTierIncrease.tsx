import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc } from "../../types/reward-types";

interface AddSummonTierIncreaseAttributeProps {
  changeValue: ChangeValueFunc;
}

const AddSummonTierIncreaseAttribute: React.FC<
  AddSummonTierIncreaseAttributeProps
> = ({ changeValue }) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("summonTierIncrease", 1)} />
      <AttributeDescription keyName="summonTierIncrease" />
    </li>
  );
};

export default AddSummonTierIncreaseAttribute;
