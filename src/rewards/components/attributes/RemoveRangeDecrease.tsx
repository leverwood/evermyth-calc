import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveRangeDecreaseProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveRangeDecrease: React.FC<RemoveRangeDecreaseProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.rangeDecrease) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        onClick={() => changeValue("rangeDecrease", false)}
        adding={false}
      />
      <AttributeDescription keyName="rangeDecrease" />
    </li>
  );
};

export default RemoveRangeDecrease;
