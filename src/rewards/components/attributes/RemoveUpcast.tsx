import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveUpcastProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
  rewards: RewardData[];
}

const RemoveUpcast: React.FC<RemoveUpcastProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.upcast) return null;
  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("upcast", false)}
      />
      <AttributeDescription keyName="upcast" />
      <strong> {selectedOptions.upcast.name}</strong>
    </li>
  );
};

export default RemoveUpcast;
