import { useEffect, useState } from "react";

import styles from "./AddAttributes.module.scss";
import { isStringArray, OPTION_COST, RewardData } from "../types/reward-types";
import { ChangeValueFunc } from "../types/reward-types";
import { attributeComponents } from "./AddAttributeComponents";
import { jsxToString } from "../util/jsx-to-string";
import { DESCRIPTIONS } from "./AttributeDescription";
import { Form, InputGroup } from "react-bootstrap";
import Slider from "rc-slider";

const findMinMaxTier = () => {
  let [minTier, maxTier] = [0, 0];
  // search OPTION_COST for the lowest and highest values
  Object.values(OPTION_COST).forEach((value) => {
    if (value < minTier) minTier = value;
    if (value > maxTier) maxTier = value;
  });
  return [minTier, maxTier];
};

export function AddAttributes({
  selectedOptions,
  changeValue,
  rewards,
  searchString,
  setSearchString,
}: {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  rewards: RewardData[];
  searchString: string;
  setSearchString: (value: string) => void;
}) {
  const [newAbility, setNewAbility] = useState("");
  const [upcastRewardIndex, setUpcastReward] = useState<number>(-1);
  const [filteredComponents, setFilteredComponents] = useState<
    {
      key: keyof RewardData;
      component: React.FC<any>;
    }[]
  >([...attributeComponents]);
  const [minTier, maxTier] = findMinMaxTier();
  const [shownTierRange, setShownTierRange] = useState<[number, number]>([
    minTier,
    maxTier,
  ]);
  const marks: {
    [key: number]: string;
  } = {};
  for (let i = minTier; i <= maxTier; i++) {
    marks[i] = `T${i}`;
  }

  useEffect(() => {
    const results: { key: keyof RewardData; component: React.FC<any> }[] = [];

    if (searchString.trim()) {
      Object.keys(DESCRIPTIONS).forEach((key) => {
        const htmlString = jsxToString(DESCRIPTIONS[key]);
        if (htmlString.toLowerCase().includes(searchString.toLowerCase())) {
          const item = attributeComponents.find(({ key: k }) => k === key);
          if (item) results.push(item);
        }
      });
    } else {
      results.push(...attributeComponents);
    }

    const filtered = results
      .filter(({ key }) => {
        const tier = OPTION_COST[key];
        return (
          tier !== undefined &&
          tier >= shownTierRange[0] &&
          tier <= shownTierRange[1]
        );
      })
      .sort((a, b) => a.key.localeCompare(b.key));

    setFilteredComponents(filtered);
  }, [searchString, shownTierRange]);

  return (
    <>
      <h3 className="mb-3 mt-3">Add attributes</h3>
      <InputGroup className="mb-4">
        <Form.Control
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder="Search"
        ></Form.Control>
        <InputGroup.Text>🔎</InputGroup.Text>
      </InputGroup>
      <Slider
        range
        className={`mb-5`}
        min={minTier}
        max={maxTier}
        marks={marks}
        step={null}
        defaultValue={[minTier, maxTier]}
        onChangeComplete={(value) =>
          setShownTierRange(
            typeof value === "number" ? [value, value] : [value[0], value[1]]
          )
        }
      />
      <ul className={styles.addList}>
        {filteredComponents.map(({ key, component: Component }) => (
          <Component
            key={key}
            index={
              (isStringArray(selectedOptions[key]) &&
                (selectedOptions[key] as string[]).length) ||
              0
            }
            selectedOptions={selectedOptions}
            changeValue={changeValue}
            rewards={rewards}
            newAbility={newAbility}
            setNewAbility={setNewAbility}
            upcastRewardIndex={upcastRewardIndex}
            setUpcastReward={setUpcastReward}
          />
        ))}
      </ul>
    </>
  );
}
