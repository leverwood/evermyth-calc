import styles from "./SingleRewardText.module.scss";
import { printRewardMessage } from "../../0.3/util/printRewardMessage";
import Markdown from "markdown-to-jsx";
import { REWARD_TYPE, Reward } from "../types/reward-types";
import { Badge } from "react-bootstrap";
import Price from "../../shops/components/Price";

const typeEmoji = (type: REWARD_TYPE) => {
  switch (type) {
    case REWARD_TYPE.EQUIPMENT:
      return "🎒";
    case REWARD_TYPE.FEATURE:
      return "✨";
    case REWARD_TYPE.TRINKET:
      return "💍";
    case REWARD_TYPE.ALLY:
      return "🧝";
    default:
      return "";
  }
};

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
  typeBefore = false,
  rawMarkdown = false,
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
  typeBefore?: boolean;
  rawMarkdown?: boolean;
}) {
  let message = printRewardMessage(reward, upcast, false, isCreature);

  if (oneLine) {
    message = message.trim().replaceAll("\n\n", " | ").replaceAll("\n", " ");
  }

  const Component = oneLine ? "span" : "div";

  return (
    <Component className={`${styles.singleRewardText} ${className}`}>
      {typeBefore && `${typeEmoji(reward.type)} `}
      {!noTitle ? (
        link ? (
          <a href={`/rewards/${reward.optionsId}/edit`}>
            {rawMarkdown && "**"}
            <Title reward={reward} noTier={noTier} />
            {rawMarkdown && "** "}
          </a>
        ) : (
          <>
            {rawMarkdown && "**"}
            <Title reward={reward} noTier={noTier} />
            {rawMarkdown && "** "}
          </>
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
      {rawMarkdown ? (
        <>
          <span
            dangerouslySetInnerHTML={{
              __html: message.replaceAll("\n\n", "<br />"),
            }}
          />
          <br />
          -----------------------
        </>
      ) : (
        <Markdown options={{}}>{message}</Markdown>
      )}
      <br />
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