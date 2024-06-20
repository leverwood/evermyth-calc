import { useCallback, useState } from "react";
import styles from "./RewardCreator.module.scss";
import { validateRewardData } from "../util/reward-calcs";
import { LOG_LEVEL, Logger } from "../../util/log";
import { RewardData } from "../types/reward-types";
import { RemoveAttributes } from "./RemoveAttributes";
import { RewardCard } from "./RewardCard";
import { SavedRewards } from "./SavedRewards";
import { isSameReward } from "../util/reward-calcs";
import { ChangeValueFunc } from "../types/reward-types";
import { getRewardsFromStorage } from "../util/reward-make";
import { Button, Col, Row } from "react-bootstrap";
import { EditReward } from "./EditReward";

export const logger = Logger(LOG_LEVEL.INFO);

// TODO:  Conditions, lingering damage
export default function RewardCreator() {
  const [savedRewards, setSavedRewards] = useState<RewardData[]>(
    getRewardsFromStorage()
  );
  const [selectedOptions, setSelectedOptions] = useState<RewardData>(
    (savedRewards.length && savedRewards[savedRewards.length - 1]) ||
      ({} as RewardData)
  );
  const errors = validateRewardData(selectedOptions).errors;
  logger.debug("errors", errors);

  const changeValue = useCallback<ChangeValueFunc>((key, value, index = -1) => {
    // set the new value
    setSelectedOptions((prevState) => {
      let newKey = key;
      let newValue: RewardData[keyof RewardData] = value;

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
          console.log("Unhandled changeValue", key, value);
          newValue =
            typeof newValue === "number"
              ? ((prevState[key as keyof RewardData] as number) || 0) + newValue
              : newValue;
          break;
      }

      console.log(
        "changeValue",
        key,
        value,
        newKey,
        newValue,
        index,
        prevState
      );

      const newState: RewardData = {
        ...prevState,
        [newKey]: newValue,
      };

      // save this into the rewards list
      setSavedRewards((prevSavedRewards) => {
        const newRewardsList = [...prevSavedRewards];
        if (newRewardsList.length === 0) newRewardsList.push({} as RewardData);
        else newRewardsList[newRewardsList.length - 1] = newState;
        setSavedRewards(newRewardsList);
        localStorage.setItem("rewards", JSON.stringify(newRewardsList));
        logger.debug("Saving to localStorage", newRewardsList);
        return newRewardsList;
      });

      // return the new reward options
      return newState;
    });
  }, []);

  const handleClickLoad = useCallback(
    (index: number) => {
      logger.debug("----- handleClickLoad ------", savedRewards[index]);

      // This runs twice in strict mode
      setSavedRewards((prevRewards) => {
        const newRewards = [...prevRewards];

        // nothing has happened, just move this index to the end
        if (!Object.keys(newRewards[newRewards.length - 1]).length) {
          logger.log(
            "The current reward is empty, move the intended reward to the end of the list"
          );
          const loadThis = newRewards[index];
          newRewards.splice(index, 1);
          newRewards[newRewards.length - 1] = loadThis;
        } else {
          // save the current reward
          newRewards[newRewards.length - 1] = selectedOptions;

          // swap indexes
          [newRewards[index], newRewards[newRewards.length - 1]] = [
            newRewards[newRewards.length - 1],
            newRewards[index],
          ];
        }

        // load the one I want
        logger.log("Load", newRewards[newRewards.length - 1]);
        setSelectedOptions(newRewards[newRewards.length - 1]);

        // save it
        localStorage.setItem("rewards", JSON.stringify(newRewards));
        logger.debug("Saving to localStorage", newRewards);
        return newRewards;
      });
    },
    [savedRewards, selectedOptions]
  );

  const handleClickCopy = useCallback(
    (index: number) => {
      logger.debug("----- handleClickCopy ------", savedRewards[index]);

      // This runs twice in strict mode
      setSavedRewards((prevRewards) => {
        const newRewards = [...prevRewards];
        const copy = { ...prevRewards[index], id: crypto.randomUUID() };

        if (Object.keys(newRewards[newRewards.length - 1]).length) {
          // save the currently loaded reward
          newRewards[newRewards.length - 1] = selectedOptions;
        } else {
          // or remove the empty one
          newRewards.pop();
        }
        newRewards.push(copy);
        setSelectedOptions(copy);
        localStorage.setItem("rewards", JSON.stringify(newRewards));
        logger.debug("Saving to localStorage", newRewards);
        return newRewards;
      });
    },
    [savedRewards, selectedOptions]
  );

  const handleCreateNew = useCallback(() => {
    setSavedRewards((prevRewards) => {
      const newReward = {
        id: crypto.randomUUID(),
      } as RewardData;
      const newRewards = [...prevRewards, newReward];
      localStorage.setItem("rewards", JSON.stringify(newRewards));
      logger.debug("Saving to localStorage", newRewards);
      setSelectedOptions(newReward);
      return newRewards;
    });
  }, []);

  const handleClickDelete = (index: number) => {
    setSavedRewards((prevRewards) => {
      const newRewards = prevRewards.filter((_, i) => i !== index);
      localStorage.setItem("rewards", JSON.stringify(newRewards));
      logger.debug("Saving to localStorage", newRewards);
      return newRewards;
    });
  };

  return (
    <div className={styles.root}>
      <h1>Reward Creator</h1>
      <SavedRewards
        handleClickLoad={handleClickLoad}
        savedRewards={savedRewards}
        handleClickDelete={handleClickDelete}
        handleClickCopy={handleClickCopy}
      />
      <Row className="mt-4">
        <EditReward
          selectedOptions={selectedOptions}
          changeValue={changeValue}
          savedRewards={savedRewards}
        />
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
    </div>
  );
}
