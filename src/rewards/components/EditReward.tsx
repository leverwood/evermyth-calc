import styles from "./RewardCreator.module.scss";
import { RewardData, REWARD_TYPE } from "../types/reward-types";
import { AddAttributes } from "./AddAttributes";
import { ChangeValueFunc } from "../types/reward-types";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { logger } from "./RewardList";
import { CombinedReward } from "./CombinedReward";
import { useCallback, useState } from "react";
import { isSameReward, validateRewardData } from "../util/reward-calcs";
import { RewardCard } from "./RewardCard";
import { RemoveAttributes } from "./RemoveAttributes";
import { useRewardContext } from "../contexts/RewardContext";

export function EditReward({ id }: { id: string }) {
  const {
    rewards: savedRewards,
    addReward,
    updateReward,
    getRewardById,
  } = useRewardContext();
  const selectedOptions = getRewardById(id);
  const [priceStr, setPriceStr] = useState<string>("" + selectedOptions?.price);
  const errors = validateRewardData(selectedOptions || {}).errors;
  logger.debug("errors", errors);

  const changeValue = useCallback<ChangeValueFunc>(
    (key, value, index = -1) => {
      // set the new value
      let newKey = key;
      let newValue: RewardData[keyof RewardData] = value;
      const prevState = { ...selectedOptions };

      switch (key) {
        case "addMultiReward":
          if (typeof value === "object") {
            newKey = "multiRewards";
            newValue = [
              ...(prevState.multiRewards || []),
              newValue as RewardData,
            ];
          }
          break;
        case "deleteMultiReward":
          if (typeof value === "object") {
            newKey = "multiRewards";
            newValue = (prevState.multiRewards || []).filter(
              (opt) => !isSameReward(opt, newValue as RewardData)
            );
          }
          break;
        case "addAbility":
          newKey = "grantsAbilities";
          newValue = [...(prevState.grantsAbilities || []), value as string];
          break;
        case "deleteAbility":
          newKey = "grantsAbilities";
          newValue = [...(prevState.grantsAbilities || [])];
          newValue.splice(index, 1);
          break;
        case "changeAbility":
          newKey = "grantsAbilities";
          newValue = (prevState.grantsAbilities || []).map((ability, i) =>
            i === index ? (value as string) : ability
          );
          break;
        case "upcast":
          if (value === false) {
            newKey = "upcast";
            newValue = undefined;
          }
          break;
        case "price":
          newValue = parseInt(value as string);
          break;
        default:
          console.log("Unhandled value", key, value);
          newValue =
            typeof newValue === "number"
              ? ((prevState[key as keyof RewardData] as number) || 0) + newValue
              : newValue;
          break;
      }

      const newState: RewardData = {
        ...prevState,
        [newKey]: newValue,
      };

      // save this into the rewards list
      updateReward(newState);
    },
    [selectedOptions, updateReward]
  );

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

  const handleCreateNew = useCallback(() => {
    if (selectedOptions) addReward(selectedOptions);
  }, [addReward, selectedOptions]);

  logger.debug("EditReward - selectedOptions", selectedOptions);

  if (!selectedOptions) return null;

  return (
    <Row>
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
      <Col className={styles.resultsColumn}>
        {Object.keys(selectedOptions).length ? (
          <Button onClick={handleCreateNew}>Create New</Button>
        ) : null}
        {errors.length && Object.keys(selectedOptions).length ? (
          <div>
            <strong className={styles.errorTitle}>Errors</strong>
            <ul className={styles.errorList}>
              {validateRewardData(selectedOptions).errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <RewardCard RewardData={selectedOptions} />
        <RemoveAttributes
          selectedOptions={selectedOptions}
          changeValue={changeValue}
          savedRewards={savedRewards}
        />
        <div>
          Override description
          <br />
          <textarea
            className={styles.textarea}
            value={selectedOptions.instructions || ""}
            onChange={(e) => changeValue("instructions", e.target.value)}
            placeholder="description"
          ></textarea>
        </div>
        <div>
          Notes
          <br />
          <textarea
            className={styles.textarea}
            value={selectedOptions.notes || ""}
            placeholder="notes"
            onChange={(e) => changeValue("notes", e.target.value)}
          />
        </div>
        <pre className={styles.jsonDump}>
          {JSON.stringify(selectedOptions, null, 2)}
        </pre>
      </Col>
    </Row>
  );
}
