import styles from "./RewardCreator.module.scss";
import { RewardData, REWARD_TYPE, STAGE } from "../types/reward-types";
import { AddAttributes } from "./AddAttributes";
import { ChangeValueFunc } from "../types/reward-types";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { logger } from "./RewardList";
import { CombinedReward } from "./CombinedReward";
import { useCallback, useState } from "react";
import {
  initReward,
  isSameReward,
  validateRewardData,
} from "../util/reward-calcs";
import { RewardCard } from "./RewardCard";
import { RemoveAttributes } from "./RemoveAttributes";
import { useRewardContext } from "../contexts/RewardContext";
import ShopCategoryCheckboxes from "../../shops/components/ShopCategoryCheckboxes";
import { ShopCategory } from "../../shops/types/shop-types";
import { ShopProvider } from "../../shops/contexts/ShopContext";
import { printRewardMessage } from "../../0.3/util/printRewardMessage";

export function EditReward({ id }: { id: string }) {
  const {
    rewards: savedRewards,
    updateReward,
    getRewardById,
  } = useRewardContext();
  const selectedOptions = getRewardById(id);
  const [priceStr, setPriceStr] = useState<string>("" + selectedOptions?.price);
  const errors = validateRewardData(selectedOptions || {}).errors;
  const [searchString, setSearchString] = useState("");
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
        case "overrideTier":
          newValue = value ? parseInt(value as string) : 0;
          break;
        case "immune":
        case "resistant":
        case "vulnerable":
        case "imposeVulnerable":
          newKey = key;
          const newArray = prevState[key as keyof RewardData]
            ? [...(prevState[key as keyof RewardData] as string[])]
            : [];
          if (typeof value === "string") newArray[index] = value as string;
          else if (typeof value === "undefined") newArray.splice(index, 1);
          newValue = newArray;
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

  const handleSetCheckedCategories = useCallback(
    (checked: React.SetStateAction<ShopCategory["slug"][]>) => {
      // If `checked` is a function, we need to get the new state by calling it with the previous state
      const newChecked =
        typeof checked === "function"
          ? checked(selectedOptions?.shopCategories || [])
          : checked;

      if (!newChecked) return;

      const newReward = { ...selectedOptions };
      newReward.shopCategories = [...newChecked];
      updateReward(newReward);

      return newChecked;
    },
    [selectedOptions, updateReward]
  );

  if (!selectedOptions) {
    return (
      <div>
        <h2>Could not find reward with id {id}</h2>
      </div>
    );
  }

  return (
    <ShopProvider>
      <Row style={{ maxWidth: "100%" }}>
        <Form as={Col} className={`${styles.selectColumn} mb-3`}>
          <InputGroup size="lg">
            <InputGroup.Text>Name</InputGroup.Text>
            <Form.Control
              id="rewardName"
              type="text"
              value={selectedOptions.name || ""}
              onChange={(e) => changeValue("name", e.target.value)}
            />
          </InputGroup>
          <InputGroup size="sm" className={`mt-3`}>
            <InputGroup.Text>Image URL</InputGroup.Text>
            <Form.Control
              id="frontImg"
              type="text"
              value={selectedOptions.frontImg || ""}
              onChange={(e) => changeValue("frontImg", e.target.value)}
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
              id="type-trinket"
              type="radio"
              name="type"
              label="Trinket"
              value={REWARD_TYPE.TRINKET}
              checked={selectedOptions.type === REWARD_TYPE.TRINKET}
              onChange={() => changeValue("type", REWARD_TYPE.TRINKET)}
            />
            <Form.Check
              inline
              id="type-ally"
              type="radio"
              name="type"
              label="Ally/Vehicle"
              value={REWARD_TYPE.ALLY}
              checked={selectedOptions.type === REWARD_TYPE.ALLY}
              onChange={() => changeValue("type", REWARD_TYPE.ALLY)}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Check
              inline
              id="stage-action"
              type="radio"
              label={"Check"}
              value={STAGE.CHECK}
              checked={selectedOptions.stage === STAGE.CHECK}
              onChange={() => changeValue("stage", STAGE.CHECK)}
            />
            <Form.Check
              inline
              id="stage-defense"
              type="radio"
              label="Defense"
              value={STAGE.DEFENSE}
              checked={selectedOptions.stage === STAGE.DEFENSE}
              onChange={() => changeValue("stage", STAGE.DEFENSE)}
            />
            <Form.Check
              inline
              id="stage-move"
              type="radio"
              label="Move (+1)"
              value={STAGE.MOVE}
              checked={selectedOptions.stage === STAGE.MOVE}
              onChange={() => changeValue("stage", STAGE.MOVE)}
            />
            <Form.Check
              inline
              id="stage-passive"
              type="radio"
              label="Passive (+1)"
              value={STAGE.PASSIVE}
              checked={selectedOptions.stage === STAGE.PASSIVE}
              onChange={() => changeValue("stage", STAGE.PASSIVE)}
            />
            <Form.Check
              inline
              id="stage-minor"
              type="radio"
              label="Action - No Roll (+2)"
              value={STAGE.ACTION}
              checked={selectedOptions.stage === STAGE.ACTION}
              onChange={() => changeValue("stage", STAGE.ACTION)}
            />
          </Form.Group>
          <InputGroup size="sm" className={`mt-3`}>
            <InputGroup.Text>Source</InputGroup.Text>
            <Form.Control
              id="source"
              type="text"
              value={selectedOptions.source || ""}
              onChange={(e) => changeValue("source", e.target.value)}
            />
          </InputGroup>
          <InputGroup size="sm" className={`mt-3`}>
            <InputGroup.Text>System Version</InputGroup.Text>
            <Form.Control
              id="version"
              type="text"
              value={selectedOptions.version || ""}
              onChange={(e) => changeValue("version", e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-4 mt-4">
            <Form.Control
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              placeholder="Search"
            ></Form.Control>
            <InputGroup.Text>🔎</InputGroup.Text>
          </InputGroup>
          {selectedOptions.type !== REWARD_TYPE.TRINKET &&
            selectedOptions.type !== REWARD_TYPE.ALLY && (
              <AddAttributes
                selectedOptions={selectedOptions}
                changeValue={changeValue}
                rewards={savedRewards}
                searchString={searchString}
              />
            )}
          {selectedOptions.type !== REWARD_TYPE.TRINKET && (
            <CombinedReward
              searchString={searchString}
              selectedOptions={selectedOptions}
              savedRewards={savedRewards}
              changeValue={changeValue}
              adding={true}
            />
          )}
        </Form>
        <Col className={styles.resultsColumn}>
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
          <Row>
            <Col>
              <RewardCard rewardData={selectedOptions} />
              <Form.Check
                className={`mt-3`}
                id="stretchImgY"
                type="checkbox"
                label="Force image cover entire card"
                checked={selectedOptions.stretchImgY || false}
                onChange={(e) => changeValue("stretchImgY", e.target.checked)}
              />
              <Form.Check
                className={`mt-3`}
                id="padImage"
                type="checkbox"
                label="Add padding to image"
                checked={selectedOptions.padImage || false}
                onChange={(e) => changeValue("padImage", e.target.checked)}
              />
            </Col>
            <Col>
              <InputGroup size="lg" className="mt-3 mb-3">
                <InputGroup.Text>Price (cp)</InputGroup.Text>
                <Form.Control
                  id="rewardPrice"
                  type="number"
                  min="0"
                  value={priceStr || ""}
                  onChange={handleChangePrice}
                />
              </InputGroup>
              <ul>
                <li>Tier 0 is 1c - 25c </li>
                <li>Tier 1 is 26c - 250c</li>
                <li>Tier 2 is 251c - 2,500c</li>
                <li>Tier 3 is 2,501c - 25,000c</li>
                <li>Tier 4 is 25,001c - 250,000c</li>
              </ul>
              <ShopCategoryCheckboxes
                checkedCategories={selectedOptions.shopCategories || []}
                setChecked={handleSetCheckedCategories}
              />
            </Col>
          </Row>

          {selectedOptions.type === REWARD_TYPE.ALLY && (
            <InputGroup className={`mt-3`}>
              <InputGroup.Text>Tier</InputGroup.Text>
              <Form.Control
                id="override-tier"
                type="number"
                value={selectedOptions.overrideTier || 0}
                onChange={(e) => changeValue("overrideTier", e.target.value)}
              />
            </InputGroup>
          )}

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
          {selectedOptions.instructions && (
            <p>
              <strong>Original text:</strong>{" "}
              {printRewardMessage(initReward(selectedOptions), false, true)}
            </p>
          )}
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
          <p>
            Created:{" "}
            {selectedOptions.created
              ? new Date(selectedOptions.created).toLocaleString()
              : "N/A"}
          </p>
        </Col>
      </Row>
    </ShopProvider>
  );
}
