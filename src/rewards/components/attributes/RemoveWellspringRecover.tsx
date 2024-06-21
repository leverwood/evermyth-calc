import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveWellspringRecoverProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveWellspringRecover: React.FC<RemoveWellspringRecoverProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.wellspringRecover) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        onClick={() => changeValue("wellspringRecover", -1)}
        adding={false}
        overrideText={`❌ (current: ${selectedOptions.wellspringRecover})`}
      />
      <AttributeDescription keyName="wellspringRecover" />
    </li>
  );
};

export default RemoveWellspringRecover;
