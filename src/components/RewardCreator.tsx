import React, { useState } from "react";
import styles from "./RewardCreator.module.scss";
import { ATTRIBUTES, RewardAttribute } from "../util/constants";
import { doesRewardScale, printReward, rewardTier } from "../util/rewardCalcs";

const SAVED_REWARDS = [
  {
    name: "Recovery",
    tier: 1,
    description: "safe action, restores 2d4 (4), 10 minutes, wellspring",
  },
  {
    name: "Potion of Healing",
    tier: 0,
    description: "no action, restores 1d4",
  },
  {
    name: "Potion of Healing",
    tier: 1,
    description: "no action, restores 2d4 (4)",
  },
  {
    name: "Healing word",
    tier: 1,
    description: "safe action, restores 1d4 (2), wellspring",
  },
  {
    name: "Tavern Brawler",
    tier: "Scales",
    description:
      "Advantage, deals tier + 1. Pick up a mundane object and use it as a weapon. The attack is always non-lethal.",
  },
  {
    name: "Meteor Swarm",
    tier: 18,
    description:
      "+26, deals 4d6 + 2 (14) AOE, on fail deals 2d10 (10) to your [POOL]",
  },
  {
    name: "Flask of Oil",
    tier: 0,
    description:
      "Consumable. As a safe action, you can splash the oil onto a creature in your zone or throw it to a nearby zone, shattering it on impact. If it is then ignited, deal 1d6. It takes 1 action to put the fire out. Otherwise, the fire deals 1 point at the end of their turn.",
  },
  {
    name: "Padded Armor",
    tier: 0,
    description: "+1 defense, but stealth with disadvantage",
  },
  {
    name: "Hunting Trap",
    tier: 0,
    description:
      "It takes a risky action to set and disguse the trap. On a failure, it deals 1 to your TOU. If a creature steps on it, it takes 1d4 (2) TOU and cannot move until it uses an action free itself, taking an additional 1 TOU when it does.",
  },
];

const RewardCreator = () => {
  const [availableOptions, setAvailableOptions] = useState<RewardAttribute[]>([
    ...ATTRIBUTES,
  ]);
  const [attributeOption, setAttributeOption] = useState<RewardAttribute>(
    ATTRIBUTES[0]
  );
  const [selectedAttributes, setSelectedAttributes] = useState<
    RewardAttribute[]
  >([]);

  // change select box
  const handleAttributeSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = parseInt(event.target.value, 10);
    const value = availableOptions.find((option) => option.id === selectedId);
    console.log("value", value);
    if (value) setAttributeOption(value);
  };

  const handleAddAttribute = () => {
    if (attributeOption) {
      setSelectedAttributes((prevList) => [...prevList, attributeOption]);

      // remove option if it can only be selected once
      if (attributeOption.once) {
        setAvailableOptions((prevList) => {
          const newList = prevList.filter(
            (option) => option !== attributeOption
          );
          setAttributeOption(newList[0]);
          return newList;
        });
      }
    }
  };

  const handleRemoveAttribute = (index: number) => {
    setSelectedAttributes((prevList) => {
      const newList = [...prevList];
      newList.splice(index, 1);

      // add back if once
      if (selectedAttributes[index].once) {
        setAvailableOptions((prevList) => [
          ...prevList,
          selectedAttributes[index],
        ]);
      }

      return newList;
    });
  };

  return (
    <div className={styles.root}>
      <h2>Reward Attribute Selector</h2>
      <select value={attributeOption.id} onChange={handleAttributeSelection}>
        {availableOptions
          .sort((a, b) => a.tier - b.tier)
          .map((attribute) => (
            <option key={attribute.id} value={attribute.id}>
              {`(${attribute.tier >= 0 ? "+" : ""}${attribute.tier}${
                doesRewardScale([attribute]) ? " scales" : ""
              }) `}
              {attribute.description}
              {attribute.once && " (once)"}
            </option>
          ))}
      </select>
      <button onClick={handleAddAttribute}>Add</button>
      <div className={styles.columns}>
        <div>
          <h3>Saved Rewards:</h3>
          <ul>
            {SAVED_REWARDS.map((reward, index) => (
              <li key={index}>
                <span className={styles.rewardName}>
                  {reward.name}
                  {typeof reward.tier === "string"
                    ? ` (${reward.tier})`
                    : reward.tier > 0
                    ? ` (Tier ${reward.tier})`
                    : ""}
                  .
                </span>{" "}
                {reward.description}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Selected Attributes:</h3>
          <ul>
            {selectedAttributes.map((attribute, index) => (
              <li key={index}>
                {`(${attribute.tier >= 0 ? "+" : ""}${attribute.tier}${
                  doesRewardScale([attribute]) ? " scales" : ""
                }) `}{" "}
                {attribute.description}{" "}
                <button onClick={() => handleRemoveAttribute(index)}>x</button>
              </li>
            ))}
          </ul>
          <h3>Result</h3>
          <p></p>
          <p>
            (T{rewardTier(selectedAttributes)}
            {doesRewardScale(selectedAttributes) ? " scales" : ""}){" "}
            {printReward(selectedAttributes)}
          </p>
          {doesRewardScale(selectedAttributes) &&
            rewardTier(selectedAttributes) !== 1 &&
            "Scaling rewards must have a tier of 1"}
          {selectedAttributes.length && (
            <p className={styles.codeBlock}>
              {JSON.stringify(selectedAttributes)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardCreator;
