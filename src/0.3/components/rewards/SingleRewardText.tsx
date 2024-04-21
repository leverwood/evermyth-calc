import styles from "./RewardCreatorNew.module.scss";
import { printRewardMessage } from "../../util/printRewardMessage";
import Markdown from "markdown-to-jsx";
import { Reward } from "../../types/reward-types";

export function SingleRewardText({
  reward,
  className = "",
  noTitle = false,
  noType = false,
  oneLine = false,
  noTier = false,
  upcast = false,
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
      {!noType ? (
        <span
          className={`${styles.typeTag} ${
            styles[reward.type.toLocaleLowerCase()]
          }`}
        >
          {reward.type}
        </span>
      ) : null}
      {reward.instructions && !oneLine ? (
        <Markdown>{reward.instructions}</Markdown>
      ) : (
        printRewardMessage(reward, upcast)
      )}{" "}
    </span>
  );
}
