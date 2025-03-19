import React from "react";
import AddRemoveButton from "../../../components/AddRemoveButton";
import AttributeDescription from "../AttributeDescription";
import {
  ChangeValueFunc,
  DMG_TYPE_OPTIONS,
  RewardData,
} from "../../types/reward-types";

interface AddOnFailTakeDamageProps {
  changeValue: ChangeValueFunc;
  selectedOptions: RewardData;
}

const AddOnFailTakeDamage: React.FC<AddOnFailTakeDamageProps> = ({
  changeValue,
  selectedOptions,
}) => {
  return (
    <li>
      <AddRemoveButton onClick={() => changeValue("onFailTakeDamage", 1)} />
      <AttributeDescription keyName="onFailTakeDamage" />
      {!selectedOptions.onFailTakeDamage && (
        <select
          name="onFailDmgType"
          onChange={(e) => changeValue("onFailDmgType", e.target.value)}
          value={selectedOptions.onFailDmgType}
        >
          {Object.entries(DMG_TYPE_OPTIONS).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      )}
    </li>
  );
};

export default AddOnFailTakeDamage;
