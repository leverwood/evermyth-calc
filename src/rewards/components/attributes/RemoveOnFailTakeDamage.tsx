import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface OnFailTakeDamageProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const OnFailTakeDamage: React.FC<OnFailTakeDamageProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.onFailTakeDamage) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("onFailTakeDamage", -1)}
        overrideText={`❌ (current: ${selectedOptions.onFailTakeDamage})`}
      />
      <AttributeDescription keyName="onFailTakeDamage" />
    </li>
  );
};

export default OnFailTakeDamage;
