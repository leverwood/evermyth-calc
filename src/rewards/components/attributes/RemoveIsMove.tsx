import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveIsMoveProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveIsMove: React.FC<RemoveIsMoveProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.isMove) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("isMove", false)}
      />
      <AttributeDescription keyName="isMove" />
    </li>
  );
};

export default RemoveIsMove;
