import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveDealsProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveDeals: React.FC<RemoveDealsProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.deals) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("deals", -1)}
        overrideText={`❌ (current: ${selectedOptions.deals})`}
      />
      <AttributeDescription keyName="deals" />
    </li>
  );
};

export default RemoveDeals;
