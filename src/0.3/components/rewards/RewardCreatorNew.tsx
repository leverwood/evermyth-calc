import { useCallback, useState } from "react";
import styles from "./RewardCreatorNew.module.scss";
import { initReward, validateRewardOptions } from "../../util/reward-calcs";
import { LOG_LEVEL, Logger } from "../../../util/log";
import { PlayerRewards } from "./PlayerRewards";
import { RewardOptions, REWARD_TYPE } from "../../types/reward-types";
import { RemoveAttributes } from "./RemoveAttributes";
import { AddAttributes } from "./AddAttributes";
import { RewardCard } from "./RewardCard";
import { SingleRewardText } from "./SingleRewardText";
import { SavedRewards } from "./SavedRewards";
import { isSameReward } from "../../util/reward-calcs";
import { ChangeValueFunc } from "../../types/reward-types";

// TODO : markdown to HTML for description

const logger = Logger(LOG_LEVEL.INFO);

const getRewardsFromStorage = () => {
  const rewards = localStorage.getItem("rewards")
    ? JSON.parse(localStorage.getItem("rewards") as string)
    : ([] as RewardOptions[]);
  if (!Array.isArray(rewards)) {
    logger.error("Rewards is not an array", rewards);
    return [];
  }
  logger.debug("getRewardsFromStorage", rewards);

  // ensure they all have IDs if they don't already
  rewards.forEach((r) => {
    if (!r.id) r.id = crypto.randomUUID();
  });

  return rewards;
};

// TODO:  Conditions, upcast, upcastMax, lingering damage
export default function RewardCreatorNew() {
  const [savedRewards, setSavedRewards] = useState<RewardOptions[]>(
    getRewardsFromStorage()
  );
  const [selectedOptions, setSelectedOptions] = useState<RewardOptions>(
    (savedRewards.length && savedRewards[savedRewards.length - 1]) ||
      ({} as RewardOptions)
  );
  const errors = validateRewardOptions(selectedOptions).errors;
  logger.debug("errors", errors);

  const changeValue = useCallback<ChangeValueFunc>((key, value, index = -1) => {
    // set the new value
    setSelectedOptions((prevState) => {
      let newKey = key;
      let newValue: RewardOptions[keyof RewardOptions] = value;

      if (key === "addMultiReward" && typeof value === "object") {
        newKey = "multiRewards";
        newValue = [
          ...(prevState.multiRewards || []),
          newValue as RewardOptions,
        ];
      } else if (key === "deleteMultiReward" && typeof value === "object") {
        newKey = "multiRewards";
        newValue = (prevState.multiRewards || []).filter(
          (opt) => !isSameReward(opt, newValue as RewardOptions)
        );
      } else if (key === "addAbility") {
        newKey = "grantsAbilities";
        newValue = [...(prevState.grantsAbilities || []), value as string];
      } else if (key === "deleteAbility") {
        newKey = "grantsAbilities";
        newValue = (prevState.grantsAbilities || []).splice(index, 1);
      } else if (key === "changeAbility") {
        newKey = "grantsAbilities";
        newValue = (prevState.grantsAbilities || []).map((ability, i) =>
          i === index ? (value as string) : ability
        );
      } else if (key === "upcast" && value === false) {
        newKey = "upcast";
        newValue = undefined;
      } else if (key !== "addMultiReward" && key !== "deleteMultiReward") {
        newValue =
          typeof newValue === "number"
            ? ((prevState[key as keyof RewardOptions] as number) || 0) +
              newValue
            : newValue;
      }

      const newState: RewardOptions = {
        ...prevState,
        [newKey]: newValue,
      };

      // save this into the rewards list
      setSavedRewards((prevSavedRewards) => {
        const newRewardsList = [...prevSavedRewards];
        if (newRewardsList.length === 0)
          newRewardsList.push({} as RewardOptions);
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
      } as RewardOptions;
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
      <PlayerRewards rewards={savedRewards} />
      <SavedRewards
        handleClickLoad={handleClickLoad}
        savedRewards={savedRewards}
        handleClickDelete={handleClickDelete}
        handleClickCopy={handleClickCopy}
      />
      <section className={styles.twoColWrapper}>
        <EditReward
          selectedOptions={selectedOptions}
          changeValue={changeValue}
          savedRewards={savedRewards}
        />
        <div className={styles.resultsColumn}>
          {Object.keys(selectedOptions).length ? (
            <button onClick={handleCreateNew}>Create New</button>
          ) : null}
          {errors.length && Object.keys(selectedOptions).length ? (
            <div>
              <strong className={styles.errorTitle}>Errors</strong>
              <ul className={styles.errorList}>
                {validateRewardOptions(selectedOptions).errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <RewardCard rewardOptions={selectedOptions} />
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
        </div>
      </section>
    </div>
  );
}

function EditReward({
  selectedOptions,
  changeValue,
  savedRewards,
}: {
  selectedOptions: RewardOptions;
  changeValue: ChangeValueFunc;
  savedRewards: RewardOptions[];
}) {
  logger.debug("EditReward - selectedOptions", selectedOptions);
  return (
    <div className={styles.selectColumn}>
      <label className={styles.inputLabel} htmlFor="rewardName">
        Name
      </label>
      <input
        className={styles.input}
        id="rewardName"
        type="text"
        value={selectedOptions.name || ""}
        onChange={(e) => changeValue("name", e.target.value)}
      />
      <strong className={styles.typeHeading}>Type</strong>
      <input
        className={styles.typeChoice}
        type="radio"
        name="type"
        id="equipmentType"
        value={REWARD_TYPE.EQUIPMENT}
        checked={selectedOptions.type === REWARD_TYPE.EQUIPMENT}
        onChange={() => changeValue("type", REWARD_TYPE.EQUIPMENT)}
      />
      <label className={styles.typeChoiceLabel} htmlFor="equipmentType">
        Equipment
      </label>
      <input
        className={styles.typeChoice}
        type="radio"
        name="type"
        id="featureType"
        value={REWARD_TYPE.FEATURE}
        checked={selectedOptions.type === REWARD_TYPE.FEATURE}
        onChange={() => changeValue("type", REWARD_TYPE.FEATURE)}
      />
      <label className={styles.typeChoiceLabel} htmlFor="featureType">
        Feature
      </label>
      <input
        className={styles.typeChoice}
        type="radio"
        name="type"
        id="trainingType"
        value={REWARD_TYPE.TRAINING}
        checked={selectedOptions.type === REWARD_TYPE.TRAINING}
        onChange={() => changeValue("type", REWARD_TYPE.TRAINING)}
      />
      <label className={styles.typeChoiceLabel} htmlFor="trainingType">
        Training
      </label>
      <input
        className={styles.typeChoice}
        type="radio"
        name="type"
        id="trinketType"
        value={REWARD_TYPE.TRINKET}
        checked={selectedOptions.type === REWARD_TYPE.TRINKET}
        onChange={() => changeValue("type", REWARD_TYPE.TRINKET)}
      />
      <label className={styles.typeChoiceLabel} htmlFor="trinketType">
        Trinket
      </label>
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
    </div>
  );
}

export function CombinedReward({
  selectedOptions,
  savedRewards,
  changeValue,
  adding = true,
}: {
  selectedOptions: RewardOptions;
  savedRewards: RewardOptions[];
  changeValue: ChangeValueFunc;
  adding?: boolean;
}) {
  const multiRewards = selectedOptions.multiRewards || [];
  const list = adding ? savedRewards : multiRewards;

  return (
    <>
      <strong className={styles.addListTitle}>
        Combine{!adding ? "d" : ""} rewards
      </strong>
      <ul className={styles.combinedRewardsList}>
        {list.map((rewardOptions, index) => {
          // Adding: if it is already included, don't show it
          if (
            adding &&
            multiRewards.find((opt) => isSameReward(opt, rewardOptions))
          )
            return null;

          // ignore final reward, which is the currently edited one
          if (adding && index === list.length - 1) return null;

          // if it's a blank reward, don't show it
          if (adding && Object.keys(rewardOptions).length === 0) return null;

          // TODO: set display names for rewards
          return (
            <li className={styles.combinedRewardItem} key={index}>
              <button
                onClick={() =>
                  changeValue(
                    adding ? "addMultiReward" : "deleteMultiReward",
                    rewardOptions
                  )
                }
              >
                {adding ? "Add" : "Remove"}
              </button>
              <SingleRewardText
                className={styles.combinedRewardText}
                reward={initReward(rewardOptions)}
                oneLine={true}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}


