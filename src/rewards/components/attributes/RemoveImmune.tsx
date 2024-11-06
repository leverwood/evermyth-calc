import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveImmuneProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
  index: number;
}

const RemoveImmune: React.FC<RemoveImmuneProps> = ({
  selectedOptions,
  changeValue,
  className,
  index,
}) => {
  if (!selectedOptions.immune || !selectedOptions.immune.length) return null;

  return (
    <li className={className} data-index={index}>
      <AddRemoveButton
        onClick={() => changeValue("immune", undefined, index)}
        adding={false}
        overrideText={`❌ (current)`}
      />
      <AttributeDescription keyName="immune" />
      <input
        value={selectedOptions.immune[index] || ""}
        type="text"
        onChange={(e) => changeValue("immune", e.target.value, index)}
      />
    </li>
  );
};

export default RemoveImmune;
