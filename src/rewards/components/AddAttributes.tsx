import { useState } from "react";
import styles from "./AddAttributes.module.scss";
import AttributeDescription from "./AttributeDescription";
import { RewardData } from "../types/reward-types";
import { ChangeValueFunc } from "../types/reward-types";
import AddRemoveButton from "./AddRemoveButton";
import { Form } from "react-bootstrap";

export function AddAttributes({
  selectedOptions,
  changeValue,
  rewards,
}: {
  selectedOptions: RewardData;
  changeValue: ChangeValueFunc;
  rewards: RewardData[];
}) {
  const [newAbility, setNewAbility] = useState("");
  const [upcastRewardIndex, setUpcastReward] = useState<number>(-1);

  return (
    <>
      <h3 className="mb-3 mt-3">Add attributes</h3>
      <ul className={styles.addList}>
        {!selectedOptions.stunned && (
          <li>
            <AddRemoveButton onClick={() => changeValue("stunned", true)} />
            <AttributeDescription keyName="stunned" />
          </li>
        )}
        {!selectedOptions.noAction && (
          <li>
            <AddRemoveButton onClick={() => changeValue("noAction", true)} />
            <AttributeDescription keyName="noAction" />
          </li>
        )}
        {!selectedOptions.summon ? (
          <li>
            <AddRemoveButton onClick={() => changeValue("summon", true)} />

            <AttributeDescription keyName="summon" />
          </li>
        ) : null}
        {!selectedOptions.noCheck && !selectedOptions.noAction && (
          <li>
            <AddRemoveButton onClick={() => changeValue("noCheck", true)} />

            <AttributeDescription keyName="noCheck" />
          </li>
        )}
        {!selectedOptions.relentless && (
          <li>
            <AddRemoveButton onClick={() => changeValue("relentless", true)} />

            <AttributeDescription keyName="relentless" />
            <Form.Control
              value={selectedOptions.relentlessMsg || ""}
              type="text"
              onChange={(e) => changeValue("relentlessMsg", e.target.value)}
            />
          </li>
        )}
        {!selectedOptions.aoe && (
          <li>
            <AddRemoveButton onClick={() => changeValue("aoe", true)} />

            <AttributeDescription keyName="aoe" />
          </li>
        )}
        {selectedOptions.aoe && (
          <li>
            <AddRemoveButton onClick={() => changeValue("avoidAllies", true)} />

            <AttributeDescription keyName="avoidAllies" />
          </li>
        )}
        <li>
          <AddRemoveButton onClick={() => changeValue("lingeringDamage", 1)} />
          <AttributeDescription keyName="lingeringDamage" />
        </li>
        {!selectedOptions.teleport && (
          <li>
            <AddRemoveButton onClick={() => changeValue("teleport", true)} />

            <AttributeDescription keyName="teleport" />
          </li>
        )}
        <li>
          <AddRemoveButton
            onClick={() => changeValue("summonTierIncrease", 1)}
          />

          <AttributeDescription keyName="summonTierIncrease" />
        </li>
        <li>
          <AddRemoveButton onClick={() => changeValue("deals", 1)} />

          <AttributeDescription keyName="deals" />
        </li>
        <li>
          <AddRemoveButton onClick={() => changeValue("heals", 1)} />

          <AttributeDescription keyName="heals" />
        </li>
        <li>
          <AddRemoveButton onClick={() => changeValue("reduceDamage", 1)} />

          <AttributeDescription keyName="reduceDamage" />
        </li>
        <li>
          <AddRemoveButton
            onClick={() => {
              changeValue("addAbility", newAbility);
              setNewAbility("");
            }}
          />
          <AttributeDescription keyName="grantsAbilities" />
          <Form.Control
            value={newAbility}
            type="text"
            onChange={(e) => setNewAbility(e.target.value)}
          />
        </li>
        <li>
          <AddRemoveButton onClick={() => changeValue("wellspringMax", 1)} />

          <AttributeDescription keyName="wellspringMax" />
        </li>
        <li>
          <AddRemoveButton
            onClick={() => changeValue("wellspringRecover", 1)}
          />

          <AttributeDescription keyName="wellspringRecover" />
        </li>
        {!selectedOptions.restrained && (
          <li>
            <AddRemoveButton onClick={() => changeValue("restrained", true)} />

            <AttributeDescription keyName="restrained" />
          </li>
        )}
        <li>
          <AddRemoveButton onClick={() => changeValue("speed", 1)} />

          <AttributeDescription keyName="speed" />
        </li>
        {!selectedOptions.noChase && !selectedOptions.teleport ? (
          <li>
            <AddRemoveButton onClick={() => changeValue("noChase", true)} />

            <AttributeDescription keyName="noChase" />
          </li>
        ) : null}
        <li>
          <AddRemoveButton onClick={() => changeValue("duration", 1)} />

          <AttributeDescription keyName="duration" />
          <Form.Control
            value={selectedOptions.durationMsg || ""}
            type="text"
            onChange={(e) => changeValue("durationMsg", e.target.value)}
          />
        </li>
        {!selectedOptions.advantage && (
          <li>
            <AddRemoveButton onClick={() => changeValue("advantage", true)} />

            <AttributeDescription keyName="advantage" />
            <Form.Control
              value={selectedOptions.advantageMsg || ""}
              type="text"
              onChange={(e) => changeValue("advantageMsg", e.target.value)}
            />
          </li>
        )}
        {!selectedOptions.whileDefending && (
          <li>
            <AddRemoveButton
              size="sm"
              onClick={() => changeValue("whileDefending", true)}
            />

            <AttributeDescription keyName="whileDefending" />
          </li>
        )}
        {selectedOptions.ranged && (
          <li>
            <AddRemoveButton onClick={() => changeValue("rangeIncrease", 1)} />

            <AttributeDescription keyName="rangeIncrease" />
          </li>
        )}
        {!selectedOptions.requiresAmmo && (
          <li>
            <AddRemoveButton
              onClick={() => changeValue("requiresAmmo", true)}
            />
            <AttributeDescription keyName="requiresAmmo" />
          </li>
        )}
        {!selectedOptions.isMove && (
          <li>
            <AddRemoveButton onClick={() => changeValue("isMove", true)} />

            <AttributeDescription keyName="isMove" />
          </li>
        )}
        {!selectedOptions.ranged && (
          <li>
            <AddRemoveButton onClick={() => changeValue("ranged", true)} />

            <AttributeDescription keyName="ranged" />
          </li>
        )}
        {!selectedOptions.trained && (
          <li>
            <AddRemoveButton onClick={() => changeValue("trained", true)} />

            <AttributeDescription keyName="trained" />
            <Form.Control
              value={selectedOptions.trainedMsg || ""}
              type="text"
              onChange={(e) => changeValue("trainedMsg", e.target.value)}
            />
          </li>
        )}
        {!selectedOptions.upcast ? (
          <li>
            <AddRemoveButton
              onClick={() => changeValue("upcast", rewards[upcastRewardIndex])}
            />

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
            <AddRemoveButton
              onClick={() => changeValue("disadvantage", true)}
            />

            <AttributeDescription keyName="disadvantage" />
            <Form.Control
              value={selectedOptions.disadvantageMsg || ""}
              type="text"
              onChange={(e) => changeValue("disadvantageMsg", e.target.value)}
            />
          </li>
        )}
        <li>
          <AddRemoveButton onClick={() => changeValue("cost", 1)} />

          <AttributeDescription keyName="cost" />
        </li>
        <li>
          <AddRemoveButton onClick={() => changeValue("castTime", 1)} />

          <AttributeDescription keyName="castTime" />
          <Form.Control
            value={selectedOptions.castTimeMsg || ""}
            type="text"
            onChange={(e) => changeValue("castTimeMsg", e.target.value)}
          />
        </li>
        {!selectedOptions.specific && (
          <li>
            <AddRemoveButton onClick={() => changeValue("specific", true)} />

            <AttributeDescription keyName="specific" />
            <Form.Control
              value={selectedOptions.specificMsg || ""}
              onChange={(e) => changeValue("specificMsg", e.target.value)}
            />
          </li>
        )}
        {!selectedOptions.consumable && (
          <li>
            <AddRemoveButton onClick={() => changeValue("consumable", true)} />

            <AttributeDescription keyName="consumable" />
          </li>
        )}
      </ul>
    </>
  );
}
