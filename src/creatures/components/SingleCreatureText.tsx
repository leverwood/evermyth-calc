import { useRewardContext } from "../../rewards/contexts/RewardContext";
import { Creature, LegendaryCreature } from "../types/creature-types";
import CreatureTier from "./CreatureTier";

const SingleCreatureText = ({
  creature,
  oneLine,
}: {
  creature: Creature | LegendaryCreature;
  oneLine?: boolean;
}) => {
  const Component = oneLine ? "span" : "div";
  const { getRewardById } = useRewardContext();
  return (
    <Component>
      <strong>
        {creature.name} (
        <CreatureTier creature={creature} />
        ).{" "}
      </strong>
      {creature.description}{" "}
      {!creature.legendary &&
        creature.rewards
          .map((rewardId) => {
            const reward = getRewardById(rewardId);
            return reward?.name;
          })
          .join(", ")}
    </Component>
  );
};
export default SingleCreatureText;
