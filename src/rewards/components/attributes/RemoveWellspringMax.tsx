import React from "react";
import AddRemoveButton from "../AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveWellspringMaxProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveWellspringMax: React.FC<RemoveWellspringMaxProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.wellspringMax) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        onClick={() => changeValue("wellspringMax", -1)}
        adding={false}
      />
      <AttributeDescription keyName="wellspringMax" />
    </li>
  );
};

export default RemoveWellspringMax;
