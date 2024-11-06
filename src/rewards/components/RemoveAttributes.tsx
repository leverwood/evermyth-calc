import styles from "./RewardCreator.module.scss";
import { RewardData } from "../types/reward-types";
import { CombinedReward } from "./CombinedReward";
import { ChangeValueFunc } from "../types/reward-types";
import { attributeComponents } from "./RemoveAttributeComponents";
import RemoveResistant from "./attributes/RemoveResistant";
import RemoveImmune from "./attributes/RemoveImmune";
import RemoveVulnerable from "./attributes/RemoveVulnerable";
import RemoveImposeVulnerable from "./attributes/RemoveImposeVulnerable";

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
        {attributeComponents.map(({ key, component: Component }) => (
          <Component
            key={key}
            index={-1}
            selectedOptions={selectedOptions}
            changeValue={changeValue}
            className={styles.removeListItem}
            rewards={savedRewards}
          />
        ))}
        {selectedOptions.resistant &&
          selectedOptions.resistant.map((_, index) => (
            <RemoveResistant
              key={index}
              index={index}
              selectedOptions={selectedOptions}
              changeValue={changeValue}
              className={styles.removeListItem}
            />
          ))}
      </ul>
      {selectedOptions.immune &&
        selectedOptions.immune.map((_, index) => (
          <RemoveImmune
            key={index}
            index={index}
            selectedOptions={selectedOptions}
            changeValue={changeValue}
            className={styles.removeListItem}
          />
        ))}
      {selectedOptions.vulnerable &&
        selectedOptions.vulnerable.map((_, index) => (
          <RemoveVulnerable
            key={index}
            index={index}
            selectedOptions={selectedOptions}
            changeValue={changeValue}
            className={styles.removeListItem}
          />
        ))}
      {selectedOptions.imposeVulnerable &&
        selectedOptions.imposeVulnerable.map((_, index) => (
          <RemoveImposeVulnerable
            key={index}
            index={index}
            selectedOptions={selectedOptions}
            changeValue={changeValue}
            className={styles.removeListItem}
          />
        ))}
      <CombinedReward
        selectedOptions={selectedOptions}
        savedRewards={savedRewards}
        changeValue={changeValue}
        adding={false}
      />
    </div>
  );
}
