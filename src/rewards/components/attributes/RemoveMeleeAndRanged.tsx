import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveMeleeAndRangedProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveMeleeAndRanged: React.FC<RemoveMeleeAndRangedProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.meleeAndRanged) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("meleeAndRanged", false)}
      />
      <AttributeDescription keyName="meleeAndRanged" />
    </li>
  );
};

export default RemoveMeleeAndRanged;
