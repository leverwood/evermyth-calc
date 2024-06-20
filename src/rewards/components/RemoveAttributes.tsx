import styles from "./RewardCreator.module.scss";
import AttributeDescription from "./AttributeDescription";
import { RewardData } from "../types/reward-types";
import { CombinedReward } from "./CombinedReward";
import { ChangeValueFunc } from "../types/reward-types";
import AddRemoveButton from "./AddRemoveButton";

export function RemoveAttributes({
  selectedOptions,
  changeValue,
  savedRewards,
}: {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  savedRewards: RewardData[];
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
        {selectedOptions.lingeringDamage && (
          <li>
            <button onClick={() => changeValue("lingeringDamage", -1)}>
              -1 (now {selectedOptions.lingeringDamage})
            </button>
            <AttributeDescription keyName="lingeringDamage" />
          </li>
        )}
        {selectedOptions.teleport && (
          <li>
            <button onClick={() => changeValue("teleport", false)}>
              delete
            </button>
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
                  <AddRemoveButton
                    adding={false}
                    onClick={() => changeValue("deleteAbility", ability, i)}
                  />
                  <AttributeDescription keyName="grantsAbilities" />
                  <input
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
