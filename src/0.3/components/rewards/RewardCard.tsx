import styles from "./RewardCreator.module.scss";
import { initReward } from "../../util/reward-calcs";
import Markdown from "markdown-to-jsx";
import { RewardOptions, REWARD_TYPE } from "../../types/reward-types";
import { SingleRewardText } from "./SingleRewardText";

export function RewardCard({
  rewardOptions,
}: {
  rewardOptions: RewardOptions;
}) {
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
