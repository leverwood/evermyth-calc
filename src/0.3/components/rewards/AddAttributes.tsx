import { useState } from "react";
import styles from "./RewardCreator.module.scss";
import AttributeDescription from "./AttributeDescription";
import { RewardOptions } from "../../types/reward-types";
import { ChangeValueFunc } from "../../types/reward-types";

export function AddAttributes({
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
