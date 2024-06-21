import styles from "./SingleRewardText.module.scss";
import { printRewardMessage } from "../../0.3/util/printRewardMessage";
import Markdown from "markdown-to-jsx";
import { REWARD_TYPE, Reward } from "../types/reward-types";
import { Badge } from "react-bootstrap";
import Price from "../../shops/components/Price";

export function SingleRewardText({
  reward,
  className = "",
  noTitle = false,
  noType = false,
  oneLine = false,
  noTier = false,
  upcast = false,
  showPrice = false,
}: {
  reward: Reward;
  className?: string;
  noTitle?: boolean;
  noType?: boolean;
  oneLine?: boolean;
  noTier?: boolean;
  upcast?: boolean;
  showPrice?: boolean;
}) {
  return (
    <span className={`${styles.singleRewardText} ${className}`}>
      {!noTitle ? (
        <strong className={"me-2"}>
          {reward.name}
          {!noTier &&
            reward.type !== REWARD_TYPE.TRINKET &&
            ` (T${reward.tier < 0 ? 0 : reward.tier})`}
          .
        </strong>
      ) : null}
      {showPrice && reward.price ? <Price cp={reward.price} /> : null}
      {!noType ? (
        <Badge className={`${styles[reward.type.toLocaleLowerCase()]} me-2`}>
          &nbsp;{reward.type}&nbsp;
        </Badge>
      ) : null}
      {reward.instructions && !oneLine ? (
        <Markdown>{reward.instructions}</Markdown>
      ) : (
        <Markdown>
          {printRewardMessage(reward, upcast).replaceAll("\n", " ")}
        </Markdown>
      )}{" "}
    </span>
  );
}
