import { useCallback, useState } from "react";
import styles from "./RewardCreatorNew.module.scss";
import { initReward, validateRewardOptions } from "../util/reward-calcs";
import { printRewardMessage } from "../util/printRewardMessage";
import { LOG_LEVEL, Logger } from "../../util/log";
import Markdown from "markdown-to-jsx";
import { PlayerRewards } from "./PlayerRewards";
import AttributeDescription from "./AttributeDescription";
import { RewardOptions, REWARD_TYPE, Reward } from "../types/reward-types-new";

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
  return rewards;
};

type ChangeValueFunc = (
  key:
    | keyof RewardOptions
    | "addMultiReward"
    | "deleteMultiReward"
    | "addAbility"
    | "deleteAbility"
    | "changeAbility",
  value: number | boolean | string | RewardOptions,
  index?: number
) => void;

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

  const changeValue = useCallback<ChangeValueFunc>(
    (key, value, index = -1) => {
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
        } else if(key === "upcast" && value === false){
          newKey = "upcast";
          newValue = undefined;
        }
        else if (key !== "addMultiReward" && key !== "deleteMultiReward") {
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
        const newRewardsList = [...savedRewards];
        if (newRewardsList.length === 0)
          newRewardsList.push({} as RewardOptions);
        else newRewardsList[newRewardsList.length - 1] = newState;
        setSavedRewards(newRewardsList);
        localStorage.setItem("rewards", JSON.stringify(newRewardsList));
        logger.debug("Saving to localStorage", newRewardsList);

        // return the new reward options
        return newState;
      });
    },
    [savedRewards]
  );

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
        const copy = { ...prevRewards[index] };

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
      const newReward = {} as RewardOptions;
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

function AddAttributes({
  selectedOptions,
  changeValue,
  rewards,
}: {
  selectedOptions: RewardOptions;
  changeValue: ChangeValueFunc;
  rewards: RewardOptions[];
}) {
  const [newAbility, setNewAbility] = useState("");
  const [upcastRewardIndex, setUpcastReward] = useState<number>(-1);

  return (
    <>
      <strong className={styles.addListTitle}>Add attributes</strong>
      <ul className={styles.addList}>
        {!selectedOptions.stunned && (
          <li>
            <button onClick={() => changeValue("stunned", true)}>add</button>
            <AttributeDescription keyName="stunned" />
          </li>
        )}
        {!selectedOptions.noAction && (
          <li>
            <button onClick={() => changeValue("noAction", true)}>add</button>
            <AttributeDescription keyName="noAction" />
          </li>
        )}
        {!selectedOptions.summon ? (
          <li>
            <button onClick={() => changeValue("summon", true)}>add</button>
            <AttributeDescription keyName="summon" />
          </li>
        ) : null}
        {!selectedOptions.noCheck && !selectedOptions.noAction && (
          <li>
            <button onClick={() => changeValue("noCheck", true)}>add</button>
            <AttributeDescription keyName="noCheck" />
          </li>
        )}
        {!selectedOptions.relentless && (
          <li>
            <button onClick={() => changeValue("relentless", true)}>add</button>
            <AttributeDescription keyName="relentless" />
            <input
              className={styles.input}
              value={selectedOptions.relentlessMsg || ""}
              type="text"
              onChange={(e) => changeValue("relentlessMsg", e.target.value)}
            />
          </li>
        )}
        {!selectedOptions.aoe && (
          <li>
            <button onClick={() => changeValue("aoe", true)}>add</button>
            <AttributeDescription keyName="aoe" />
          </li>
        )}
        {!selectedOptions.teleport && (
          <li>
            <button onClick={() => changeValue("teleport", true)}>add</button>
            <AttributeDescription keyName="teleport" />
          </li>
        )}
        {selectedOptions.aoe && (
          <li>
            <button onClick={() => changeValue("avoidAllies", true)}>
              add
            </button>
            <AttributeDescription keyName="avoidAllies" />
          </li>
        )}
        <li>
          <button onClick={() => changeValue("summonTierIncrease", 1)}>
            add
          </button>
          <AttributeDescription keyName="summonTierIncrease" />
        </li>
        <li>
          <button onClick={() => changeValue("deals", 1)}>add</button>
          <AttributeDescription keyName="deals" />
        </li>
        <li>
          <button onClick={() => changeValue("heals", 1)}>add</button>
          <AttributeDescription keyName="heals" />
        </li>
        <li>
          <button onClick={() => changeValue("reduceDamage", 1)}>add</button>
          <AttributeDescription keyName="reduceDamage" />
        </li>
        <li>
          <button
            onClick={() => {
              changeValue("addAbility", newAbility);
              setNewAbility("");
            }}
          >
            add
          </button>
          <AttributeDescription keyName="grantsAbilities" />
          <input
            className={styles.input}
            value={newAbility}
            type="text"
            onChange={(e) => setNewAbility(e.target.value)}
          />
        </li>
        <li>
          <button onClick={() => changeValue("wellspringMax", 1)}>add</button>
          <AttributeDescription keyName="wellspringMax" />
        </li>
        <li>
          <button onClick={() => changeValue("wellspringRecover", 1)}>
            add
          </button>
          <AttributeDescription keyName="wellspringRecover" />
        </li>
        {!selectedOptions.restrained && (
          <li>
            <button onClick={() => changeValue("restrained", true)}>add</button>
            <AttributeDescription keyName="restrained" />
          </li>
        )}
        <li>
          <button onClick={() => changeValue("speed", 1)}>add</button>
          <AttributeDescription keyName="speed" />
        </li>
        {!selectedOptions.noChase && !selectedOptions.teleport ? (
          <li>
            <button onClick={() => changeValue("noChase", true)}>add</button>
            <AttributeDescription keyName="noChase" />
          </li>
        ) : null}
        <li>
          <button onClick={() => changeValue("duration", 1)}>add</button>
          <AttributeDescription keyName="duration" />
          <input
            className={styles.input}
            value={selectedOptions.durationMsg || ""}
            type="text"
            onChange={(e) => changeValue("durationMsg", e.target.value)}
          />
        </li>
        {!selectedOptions.advantage && (
          <li>
            <button onClick={() => changeValue("advantage", true)}>add</button>
            <AttributeDescription keyName="advantage" />
            <input
              className={styles.input}
              value={selectedOptions.advantageMsg || ""}
              type="text"
              onChange={(e) => changeValue("advantageMsg", e.target.value)}
            />
          </li>
        )}
        {!selectedOptions.whileDefending && (
          <li>
            <button onClick={() => changeValue("whileDefending", true)}>
              add
            </button>
            <AttributeDescription keyName="whileDefending" />
          </li>
        )}
        {selectedOptions.ranged && (
          <li>
            <button onClick={() => changeValue("rangeIncrease", 1)}>add</button>
            <AttributeDescription keyName="rangeIncrease" />
          </li>
        )}
        {!selectedOptions.isMove && (
          <li>
            <button onClick={() => changeValue("isMove", true)}>add</button>
            <AttributeDescription keyName="isMove" />
          </li>
        )}
        {!selectedOptions.ranged && (
          <li>
            <button onClick={() => changeValue("ranged", true)}>add</button>
            <AttributeDescription keyName="ranged" />
          </li>
        )}
        {!selectedOptions.trained && (
          <li>
            <button onClick={() => changeValue("trained", true)}>add</button>
            <AttributeDescription keyName="trained" />
            <input
              className={styles.input}
              value={selectedOptions.trainedMsg || ""}
              type="text"
              onChange={(e) => changeValue("trainedMsg", e.target.value)}
            />
          </li>
        )}
        {!selectedOptions.upcast ? (
          <li>
            <button
              onClick={() => changeValue("upcast", rewards[upcastRewardIndex])}
            >
              add
            </button>
            <AttributeDescription keyName="upcast" />
            <select
              className={styles.select}
              value={upcastRewardIndex}
              onChange={(e) => setUpcastReward(parseInt(e.target.value))}
            >
              <option value={-1}>Select a reward</option>
              {rewards.map((reward, i) => (
                <option key={i} value={i}>
                  {reward.name}
                </option>
              ))}
            </select>
          </li>
        ) : null}
        {!selectedOptions.disadvantage && (
          <li>
            <button onClick={() => changeValue("disadvantage", true)}>
              add
            </button>
            <AttributeDescription keyName="disadvantage" />
            <input
              className={styles.input}
              value={selectedOptions.disadvantageMsg || ""}
              type="text"
              onChange={(e) => changeValue("disadvantageMsg", e.target.value)}
            />
          </li>
        )}
        <li>
          <button onClick={() => changeValue("cost", 1)}>add</button>
          <AttributeDescription keyName="cost" />
        </li>
        <li>
          <button onClick={() => changeValue("castTime", 1)}>add</button>
          <AttributeDescription keyName="castTime" />
          <input
            className={styles.input}
            value={selectedOptions.castTimeMsg || ""}
            type="text"
            onChange={(e) => changeValue("castTimeMsg", e.target.value)}
          />
        </li>
        {!selectedOptions.specific && (
          <li>
            <button onClick={() => changeValue("specific", true)}>add</button>
            <AttributeDescription keyName="specific" />
            <input
              className={styles.input}
              value={selectedOptions.specificMsg || ""}
              onChange={(e) => changeValue("specificMsg", e.target.value)}
            />
          </li>
        )}
        {!selectedOptions.consumable && (
          <li>
            <button onClick={() => changeValue("consumable", true)}>add</button>
            <AttributeDescription keyName="consumable" />
          </li>
        )}
      </ul>
    </>
  );
}

function RemoveAttributes({
  selectedOptions,
  changeValue,
  savedRewards,
}: {
  selectedOptions: RewardOptions;
  changeValue: ChangeValueFunc;
  savedRewards: RewardOptions[];
}) {
  if (Object.keys(selectedOptions).length === 0) return null;

  return (
    <div>
      <strong className={styles.removeListTitle}>Remove attributes</strong>
      <ul className={styles.removeList}>
        {selectedOptions.stunned && (
          <li>
            <button onClick={() => changeValue("stunned", false)}>x</button>
            <AttributeDescription keyName="stunned" />
          </li>
        )}
        {selectedOptions.noAction && (
          <li>
            <button onClick={() => changeValue("noAction", false)}>x</button>
            <AttributeDescription keyName="noAction" />
          </li>
        )}
        {selectedOptions.summon && (
          <li>
            <button onClick={() => changeValue("summon", false)}>x</button>
            <AttributeDescription keyName="summon" />
          </li>
        )}
        {selectedOptions.noCheck && (
          <li>
            <button onClick={() => changeValue("noCheck", false)}>x</button>
            <AttributeDescription keyName="noCheck" />
          </li>
        )}
        {selectedOptions.relentless && (
          <li>
            <button onClick={() => changeValue("relentless", false)}>x</button>
            <AttributeDescription keyName="relentless" />
            <input
              className={styles.input}
              value={selectedOptions.relentlessMsg || ""}
              onChange={(e) => changeValue("relentlessMsg", e.target.value)}
            />
          </li>
        )}
        {selectedOptions.aoe && (
          <li>
            <button onClick={() => changeValue("aoe", false)}>delete</button>
            <AttributeDescription keyName="aoe" />
          </li>
        )}
        {selectedOptions.teleport && (
          <li>
            <button onClick={() => changeValue("teleport", false)}>delete</button>
            <AttributeDescription keyName="teleport" />
          </li>
        )}
        {selectedOptions.avoidAllies && (
          <li>
            <button onClick={() => changeValue("avoidAllies", false)}>
              delete
            </button>
            <AttributeDescription keyName="avoidAllies" />
          </li>
        )}
        {selectedOptions.summonTierIncrease ? (
          <li>
            <button onClick={() => changeValue("summonTierIncrease", -1)}>
              -1 (now {selectedOptions.summonTierIncrease})
            </button>
            <AttributeDescription keyName="summonTierIncrease" />
          </li>
        ) : null}
        {selectedOptions.deals ? (
          <li>
            <button onClick={() => changeValue("deals", -1)}>
              -1 (now {selectedOptions.deals})
            </button>
            <AttributeDescription keyName="deals" />
          </li>
        ) : null}
        {selectedOptions.heals ? (
          <li>
            <button onClick={() => changeValue("heals", -1)}>
              -1 (now {selectedOptions.heals})
            </button>
            <AttributeDescription keyName="heals" />
          </li>
        ) : null}
        {selectedOptions.reduceDamage ? (
          <li>
            <button onClick={() => changeValue("reduceDamage", -1)}>
              -1 (now {selectedOptions.reduceDamage})
            </button>
            <AttributeDescription keyName="reduceDamage" />
          </li>
        ) : null}
        {selectedOptions.grantsAbilities &&
        selectedOptions.grantsAbilities.length
          ? selectedOptions.grantsAbilities.map((ability, i) => {
              return (
                <li key={i}>
                  <button
                    onClick={() => changeValue("deleteAbility", ability, i)}
                  >
                    x
                  </button>
                  <AttributeDescription keyName="grantsAbilities" />
                  <input
                    className={styles.input}
                    value={ability}
                    onChange={(e) =>
                      changeValue("changeAbility", e.target.value, i)
                    }
                  />
                </li>
              );
            })
          : null}
        {selectedOptions.wellspringMax ? (
          <li>
            <button onClick={() => changeValue("wellspringMax", -1)}>
              -1 (now {selectedOptions.wellspringMax})
            </button>
            <AttributeDescription keyName="wellspringMax" />
          </li>
        ) : null}
        {selectedOptions.wellspringRecover ? (
          <li>
            <button onClick={() => changeValue("wellspringRecover", -1)}>
              -1 (now {selectedOptions.wellspringRecover})
            </button>
            <AttributeDescription keyName="wellspringRecover" />
          </li>
        ) : null}
        {selectedOptions.restrained ? (
          <li>
            <button onClick={() => changeValue("restrained", false)}>x</button>
            <AttributeDescription keyName="restrained" />
          </li>
        ) : null}
        {selectedOptions.speed ? (
          <li>
            <button onClick={() => changeValue("speed", -1)}>
              -1 (now {selectedOptions.speed})
            </button>
            <AttributeDescription keyName="speed" />
          </li>
        ) : null}
        {selectedOptions.noChase ? (
          <li>
            <button onClick={() => changeValue("noChase", false)}>x</button>
            <AttributeDescription keyName="noChase" />
          </li>
        ) : null}
        {selectedOptions.duration ? (
          <li>
            <button onClick={() => changeValue("duration", -1)}>
              -1 (now {selectedOptions.duration})
            </button>
            <AttributeDescription keyName="duration" />
            <input
              className={styles.input}
              value={selectedOptions.durationMsg || ""}
              onChange={(e) => changeValue("durationMsg", e.target.value)}
            />
          </li>
        ) : null}
        {selectedOptions.advantage ? (
          <li>
            <button onClick={() => changeValue("advantage", false)}>x</button>
            <AttributeDescription keyName="advantage" />
            <input
              className={styles.input}
              value={selectedOptions.advantageMsg || ""}
              onChange={(e) => changeValue("advantageMsg", e.target.value)}
            />
          </li>
        ) : null}
        {selectedOptions.whileDefending && (
          <li>
            <button onClick={() => changeValue("whileDefending", false)}>
              x
            </button>
            <AttributeDescription keyName="whileDefending" />
          </li>
        )}
        {selectedOptions.rangeIncrease ? (
          <li>
            <button onClick={() => changeValue("rangeIncrease", -1)}>
              -1 (now {selectedOptions.rangeIncrease})
            </button>
            <AttributeDescription keyName="rangeIncrease" />
          </li>
        ) : null}
        {selectedOptions.ranged && (
          <li>
            <button onClick={() => changeValue("ranged", false)}>x</button>
            <AttributeDescription keyName="ranged" />
          </li>
        )}
        {selectedOptions.isMove ? (
          <li>
            <button onClick={() => changeValue("isMove", false)}>x</button>
            <AttributeDescription keyName="isMove" />
          </li>
        ) : null}
        {selectedOptions.upcast ? (
          <li>
            <button onClick={() => changeValue("upcast", false)}>x</button>
            <AttributeDescription keyName="upcast" />
          </li>
        ) : null}
        {selectedOptions.trained && (
          <li>
            <button onClick={() => changeValue("trained", false)}>x</button>
            <AttributeDescription keyName="trained" />
            <input
              className={styles.input}
              value={selectedOptions.trainedMsg || ""}
              onChange={(e) => changeValue("trainedMsg", e.target.value)}
            />
          </li>
        )}
        {selectedOptions.disadvantage && (
          <li>
            <button onClick={() => changeValue("disadvantage", false)}>
              x
            </button>
            <AttributeDescription keyName="disadvantage" />
            <input
              className={styles.input}
              value={selectedOptions.disadvantageMsg || ""}
              onChange={(e) => changeValue("disadvantageMsg", e.target.value)}
            />
          </li>
        )}
        {selectedOptions.cost ? (
          <li>
            <button onClick={() => changeValue("cost", -1)}>
              -1 (now {selectedOptions.cost})
            </button>
            <AttributeDescription keyName="cost" />
          </li>
        ) : null}
        {selectedOptions.castTime ? (
          <li>
            <button onClick={() => changeValue("castTime", -1)}>
              -1 (now {selectedOptions.castTime})
            </button>
            <AttributeDescription keyName="castTime" />
            <input
              className={styles.input}
              value={selectedOptions.castTimeMsg || ""}
              onChange={(e) => changeValue("castTimeMsg", e.target.value)}
            />
          </li>
        ) : null}
        {selectedOptions.specific ? (
          <li>
            <button onClick={() => changeValue("specific", false)}>x</button>
            <AttributeDescription keyName="specific" />
            <input
              className={styles.input}
              value={selectedOptions.specificMsg || ""}
              onChange={(e) => changeValue("specificMsg", e.target.value)}
            />
          </li>
        ) : null}
        {selectedOptions.consumable ? (
          <li>
            <button onClick={() => changeValue("consumable", false)}>x</button>
            <AttributeDescription keyName="consumable" />
          </li>
        ) : null}
      </ul>
      <CombinedReward
        selectedOptions={selectedOptions}
        savedRewards={savedRewards}
        changeValue={changeValue}
        adding={false}
      />
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

// ignore name
const isSameReward = (a: RewardOptions, b: RewardOptions) => {
  const isSame =
    JSON.stringify({ ...a, name: "" }) === JSON.stringify({ ...b, name: "" });
  logger.debug(`isSameReward: ${isSame}`, a, b);
  return isSame;
};

function CombinedReward({
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

function RewardCard({ rewardOptions }: { rewardOptions: RewardOptions }) {
  if (Object.keys(rewardOptions).length === 0) return null;

  const reward = initReward(rewardOptions);

  return (
    <div className={`${styles.card} ${styles.cardMultiReward}`}>
      <header className={styles.cardHeader}>{reward.name}</header>
      {reward.multiRewards && reward.multiRewards.length ? (
        <ul className={`${styles.cardBody} ${styles.cardRewardList}`}>
          {reward.instructions ? (
            <li>
              <Markdown>{reward.instructions}</Markdown>
            </li>
          ) : null}
          {reward.multiRewards.map((opt, index) => (
            <li key={index}>
              <p>
                <SingleRewardText
                  reward={initReward(opt)}
                  noType={true}
                  noTier={true}
                />
              </p>
              {opt.upcast ? (
                <p>
                  <SingleRewardText
                    reward={initReward(opt.upcast)}
                    noType={true}
                    noTier={true}
                    upcast={true}
                  />
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className={`${styles.cardBody}`}>
          {reward.instructions ? (
            <Markdown>{reward.instructions}</Markdown>
          ) : (
            <>
              <p>
                <SingleRewardText
                  reward={reward}
                  noTitle={true}
                  noType={true}
                  noTier={true}
                />
              </p>
              {reward.upcast ? (
                <p>
                  <SingleRewardText
                    reward={initReward(reward.upcast)}
                    noType={true}
                    noTier={true}
                    upcast={true}
                  />
                </p>
              ) : null}
            </>
          )}
        </div>
      )}
      <footer
        className={`${styles.cardFooter} ${
          styles[reward.type || "".toLocaleLowerCase()]
        }`}
      >
        {reward.type !== REWARD_TYPE.TRAINING &&
        reward.type !== REWARD_TYPE.TRINKET ? (
          <span className={styles.cardTier}>
            tier {reward.tier < 0 ? 0 : reward.tier}{" "}
          </span>
        ) : null}
        <span className={`${styles.cardType}`}>
          {reward.type || "EQUIPMENT"}
        </span>{" "}
      </footer>
    </div>
  );
}

export function SingleRewardText({
  reward,
  className = "",
  noTitle = false,
  noType = false,
  oneLine = false,
  noTier = false,
  upcast = false
}: {
  reward: Reward;
  className?: string;
  noTitle?: boolean;
  noType?: boolean;
  oneLine?: boolean;
  noTier?: boolean;
  upcast?: boolean;
}) {
  return (
    <span className={`${styles.singleRewardText} ${className}`}>
      {!noTitle ? (
        <strong>
          {reward.name}
          {!noTier && ` (T${reward.tier < 0 ? 0 : reward.tier})`}.{" "}
        </strong>
      ) : null}
      {reward.instructions && !oneLine ? (
        <Markdown>{reward.instructions}</Markdown>
      ) : (
        printRewardMessage(reward, upcast)
      )}{" "}
      {!noType ? (
        <span
          className={`${styles.typeTag} ${
            styles[reward.type.toLocaleLowerCase()]
          }`}
        >
          {reward.type}
        </span>
      ) : null}
    </span>
  );
}

function SavedRewards({
  savedRewards,
  handleClickLoad,
  handleClickDelete,
  handleClickCopy,
}: {
  savedRewards: RewardOptions[];
  handleClickLoad: (index: number) => void;
  handleClickDelete: (index: number) => void;
  handleClickCopy: (index: number) => void;
}) {
  // grab all the rewards but the last one
  const showRewards = savedRewards
    .slice(0, savedRewards.length - 1)
    .sort((opt1, opt2) => {
      const r1 = initReward(opt1);
      const r2 = initReward(opt2);
      if (r1.tier < 0) r1.tier = 0;
      if (r2.tier < 0) r2.tier = 0;
      return r1.tier === r2.tier
        ? r1.name.localeCompare(r2.name)
        : r1.tier - r2.tier;
    });

  return (
    <ul className={styles.rewardList}>
      {showRewards.map((options) => {
        const reward = initReward(options);
        const index = savedRewards.findIndex((opt) => opt === options);
        return (
          <li key={index}>
            <button
              className={styles.button}
              onClick={() => handleClickLoad(index)}
            >
              Load
            </button>
            <button
              className={styles.button}
              onClick={() => handleClickCopy(index)}
            >
              Copy
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => handleClickDelete(index)}
            >
              Delete
            </button>
            <SingleRewardText
              reward={reward}
              className={styles.rewardListText}
              oneLine={true}
            />
          </li>
        );
      })}
    </ul>
  );
}
