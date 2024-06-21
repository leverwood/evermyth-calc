import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveNoChaseProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveNoChase: React.FC<RemoveNoChaseProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.noChase) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("noChase", false)}
      />
      <AttributeDescription keyName="noChase" />
    </li>
  );
};

export default RemoveNoChase;
