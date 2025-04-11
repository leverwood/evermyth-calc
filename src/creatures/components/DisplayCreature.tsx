import { useState, useEffect } from "react";
import { SingleRewardText } from "../../rewards/components/SingleRewardText";
import { useRewardContext } from "../../rewards/contexts/RewardContext";
import { RewardData } from "../../rewards/types/reward-types";
import { initReward } from "../../rewards/util/reward-calcs";
import { Creature, STATBLOCK_TYPE } from "../types/creature-types";
import Markdown from "markdown-to-jsx";

interface CreatureProps {
  creature: Creature;
  statblockType?: STATBLOCK_TYPE;
  headingLevel?: number;
}

const DisplayCreature = ({
  creature,
  statblockType,
  headingLevel,
}: CreatureProps) => {
  const { getRewardById } = useRewardContext();

  const [creatureRewards, setCreatureRewards] = useState<RewardData[]>([]);

  let HeadingComponent: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h4";
  switch (headingLevel) {
    case 1:
      HeadingComponent = "h1";
      break;
    case 2:
      HeadingComponent = "h2";
      break;
    case 3:
      HeadingComponent = "h3";
      break;
    case 4:
      HeadingComponent = "h4";
      break;
    case 5:
      HeadingComponent = "h5";
      break;
    case 6:
      HeadingComponent = "h6";
      break;
    default:
      HeadingComponent = "h4";
  }

  useEffect(() => {
    if (!creature) return;
    let list = creature.rewards.map((id) => getRewardById(id));

    let filteredList = list.filter((reward) => reward) as RewardData[];
    filteredList = filteredList.sort((a, b) =>
      (a.name || "").localeCompare(b.name || "")
    );
    setCreatureRewards(filteredList);
  }, [creature, getRewardById]);
  return (
    <div>
      <HeadingComponent className={`mb-0`}>{creature.name}</HeadingComponent>
      <p className={`mt-0`}>
        {statblockType && ` (${statblockType})`}T{creature.tier} |{" "}
        {creature.overridePool || Math.max(1, creature.tier * 4)} Pool | Target{" "}
        {creature.overrideTarget || Math.ceil(10 + creature.tier)} | WS{" "}
        {creature.overrideWellspring || creature.tier * 2}
      </p>
      <ul>
        {creatureRewards.map((reward, index) => {
          if (!reward) return null;
          return (
            <li key={index}>
              <SingleRewardText
                reward={initReward(reward)}
                oneLine={true}
                isCreature={true}
                noType={true}
              />
            </li>
          );
        })}
      </ul>
      <hr />
      <Markdown>{creature.description || ""}</Markdown>
    </div>
  );
};

export default DisplayCreature;
