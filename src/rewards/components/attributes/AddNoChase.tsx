import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";

interface AddNoChaseAttributeProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
}

const AddNoChaseAttribute: React.FC<AddNoChaseAttributeProps> = ({
  selectedOptions,
  changeValue,
}) => {
  if (selectedOptions.noChase || selectedOptions.teleport) return null;

  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("noChase", true)} />
      <AttributeDescription keyName="noChase" />
    </li>
  );
};

export default AddNoChaseAttribute;
