import styles from "./RewardCreator.module.scss";
import { RewardData, REWARD_TYPE } from "../types/reward-types";
import { AddAttributes } from "./AddAttributes";
import { ChangeValueFunc } from "../types/reward-types";
import { Col, Form, InputGroup } from "react-bootstrap";
import { logger } from "./RewardCreator";
import { CombinedReward } from "./CombinedReward";
import { useCallback, useState } from "react";

export function EditReward({
  selectedOptions,
  changeValue,
  savedRewards,
}: {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  savedRewards: RewardData[];
}) {
  const [priceStr, setPriceStr] = useState<string>("" + selectedOptions.price);

  const handleChangePrice = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPriceStr(e.target.value);
      const intValue = parseInt(e.target.value);
      console.log(
        "EditReward - handleChangePrice - e.target.value",
        e.target.value,
        "intValue",
        intValue
      );
      changeValue("price", isNaN(intValue) ? 0 : intValue);
    },
    [changeValue]
  );

  logger.debug("EditReward - selectedOptions", selectedOptions);
  return (
    <Form as={Col} className={styles.selectColumn}>
      <InputGroup size="lg">
        <InputGroup.Text>Name</InputGroup.Text>
        <Form.Control
          id="rewardName"
          type="text"
          value={selectedOptions.name || ""}
          onChange={(e) => changeValue("name", e.target.value)}
        />
      </InputGroup>
      <Form.Group className="mt-3">
        <Form.Check
          inline
          id="type-equipment"
          type="radio"
          label="Equipment"
          value={REWARD_TYPE.EQUIPMENT}
          checked={selectedOptions.type === REWARD_TYPE.EQUIPMENT}
          onChange={() => changeValue("type", REWARD_TYPE.EQUIPMENT)}
        />
        <Form.Check
          inline
          id="type-feature"
          type="radio"
          label="Feature"
          value={REWARD_TYPE.FEATURE}
          checked={selectedOptions.type === REWARD_TYPE.FEATURE}
          onChange={() => changeValue("type", REWARD_TYPE.FEATURE)}
        />
        <Form.Check
          inline
          id="trainingType"
          type="radio"
          label="Training"
          value={REWARD_TYPE.TRAINING}
          checked={selectedOptions.type === REWARD_TYPE.TRAINING}
          onChange={() => changeValue("type", REWARD_TYPE.TRAINING)}
        />
        <Form.Check
          inline
          id="trinketType"
          type="radio"
          name="type"
          label="Trinket"
          value={REWARD_TYPE.TRINKET}
          checked={selectedOptions.type === REWARD_TYPE.TRINKET}
          onChange={() => changeValue("type", REWARD_TYPE.TRINKET)}
        />
      </Form.Group>
      {(selectedOptions.type === REWARD_TYPE.EQUIPMENT ||
        selectedOptions.type === REWARD_TYPE.TRINKET ||
        selectedOptions.price) && (
        <InputGroup size="lg" className="mt-3">
          <InputGroup.Text>Price (cp)</InputGroup.Text>
          <Form.Control
            id="rewardPrice"
            type="number"
            min="0"
            value={priceStr || ""}
            onChange={handleChangePrice}
          />
        </InputGroup>
      )}
      {(!selectedOptions.multiRewards ||
        selectedOptions.multiRewards.length === 0) &&
      selectedOptions.type !== REWARD_TYPE.TRAINING ? (
        <AddAttributes
          selectedOptions={selectedOptions}
          changeValue={changeValue}
          rewards={savedRewards}
        />
      ) : null}
      {selectedOptions.type !== REWARD_TYPE.TRAINING && (
        <CombinedReward
          selectedOptions={selectedOptions}
          savedRewards={savedRewards}
          changeValue={changeValue}
          adding={true}
        />
      )}
    </Form>
  );
}
