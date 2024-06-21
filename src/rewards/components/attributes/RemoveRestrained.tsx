import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveRestrainedProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveRestrained: React.FC<RemoveRestrainedProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.restrained) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("restrained", false)}
      />
      <AttributeDescription keyName="restrained" />
    </li>
  );
};

export default RemoveRestrained;
