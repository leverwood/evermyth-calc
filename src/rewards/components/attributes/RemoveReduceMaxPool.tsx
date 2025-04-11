import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveReduceMaxPoolProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveReduceMaxPool: React.FC<RemoveReduceMaxPoolProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.reduceMaxPool) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("reduceMaxPool", -1)}
        overrideText={`❌ (current: ${selectedOptions.reduceMaxPool})`}
      />
      <AttributeDescription keyName="reduceMaxPool" />
    </li>
  );
};

export default RemoveReduceMaxPool;
