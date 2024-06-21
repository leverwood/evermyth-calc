import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import { ChangeValueFunc, RewardData } from "../../types/reward-types";
interface RemoveRequiresAmmoProps {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  className?: string;
}

const RemoveRequiresAmmo: React.FC<RemoveRequiresAmmoProps> = ({
  selectedOptions,
  changeValue,
  className,
}) => {
  if (!selectedOptions.requiresAmmo) return null;

  return (
    <li className={className}>
      <AddRemoveButton
        adding={false}
        onClick={() => changeValue("requiresAmmo", false)}
      />
      <AttributeDescription keyName="requiresAmmo" />
    </li>
  );
};

export default RemoveRequiresAmmo;
