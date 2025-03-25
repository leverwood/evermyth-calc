import { useCreatureContext } from "../contexts/CreatureContext";
import { Creature, LegendaryCreature } from "../types/creature-types";
import { getLegendaryTier } from "../util/creature-calcs";

const CreatureTier = ({ creature }: { creature: Creature | LegendaryCreature }) => {
  const {getCreatureById} = useCreatureContext();
  if (creature.legendary) {
    const tier = getLegendaryTier(creature, getCreatureById);
    if (tier.total === tier.withoutLair) return <span>{`T${tier.total}, max = T${tier.maxTier}`}</span>;
    return <span>{`T${tier.withoutLair}, T${tier.total} in lair, Max = T${tier.maxTier}`}</span>;
  } else return <span>{`T${creature.tier}`}</span>;
};


export default CreatureTier;