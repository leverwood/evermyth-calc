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
  link = false,
  isCreature = false,
}: {
  reward: Reward;
  className?: string;
  noTitle?: boolean;
  noType?: boolean;
  oneLine?: boolean;
  noTier?: boolean;
  upcast?: boolean;
  showPrice?: boolean;
  link?: boolean;
  isCreature?: boolean;
}) {
  let message = printRewardMessage(reward, upcast, false, isCreature);

  if (oneLine) {
    message = message.trim().replaceAll("\n\n", " | ").replaceAll("\n", " ");
  }

  const Component = oneLine ? "span" : "div";

  return (
    <Component className={`${styles.singleRewardText} ${className}`}>
      {!noTitle ? (
        link ? (
          <a href={`/rewards/${reward.optionsId}/edit`}>
            <Title reward={reward} noTier={noTier} />
          </a>
        ) : (
          <Title reward={reward} noTier={noTier} />
        )
      ) : null}
      {showPrice && reward.price ? <Price cp={reward.price} /> : null}
      {!noType ? (
        <Badge
          className={`${styles[reward.type.toLocaleLowerCase()]} ${
            styles.badge
          } me-2`}
        >
          &nbsp;{reward.type}&nbsp;
        </Badge>
      ) : null}
      {<Markdown>{message}</Markdown>}{" "}
    </Component>
  );
}

const Title = ({ reward, noTier }: { reward: Reward; noTier?: boolean }) => (
  <strong className={"me-2"}>
    {reward.name}
    {!noTier && reward.type !== REWARD_TYPE.TRINKET && reward.tier > 0
      ? ` (T${reward.tier})`
      : ""}
    .
  </strong>
);