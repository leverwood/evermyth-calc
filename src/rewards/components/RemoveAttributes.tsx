import styles from "./RewardCreator.module.scss";
import { RewardData } from "../types/reward-types";
import { CombinedReward } from "./CombinedReward";
import { ChangeValueFunc } from "../types/reward-types";
import { attributeComponents } from "./RemoveAttributeComponents";

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
            selectedOptions={selectedOptions}
            changeValue={changeValue}
            className={styles.removeListItem}
            rewards={savedRewards}
          />
        ))}
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
