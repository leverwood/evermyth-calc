import styles from "./SingleRewardText.module.scss";
import { printRewardMessage } from "../../util/printRewardMessage";
import Markdown from "markdown-to-jsx";
import { Reward } from "../../types/reward-types";
import { Badge } from "react-bootstrap";

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
        <strong className={"me-2"}>
          {reward.name}
          {!noTier && ` (T${reward.tier < 0 ? 0 : reward.tier})`}.
        </strong>
      ) : null}
      &nbsp;
      {!noType ? (
        <Badge className={`${styles[reward.type.toLocaleLowerCase()]} me-2`}>
          &nbsp;{reward.type}&nbsp;
        </Badge>
      ) : null}
      &nbsp;
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
