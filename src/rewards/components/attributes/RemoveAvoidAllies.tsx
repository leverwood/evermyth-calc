import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveAvoidAlliesProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveAvoidAllies: React.FC<RemoveAvoidAlliesProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.avoidAllies) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("avoidAllies", false)}
      />
      <AttributeDescription keyName="avoidAllies" />
    </li>
  );
};

export default RemoveAvoidAllies;
