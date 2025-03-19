import { Creature } from "../types/creature-types";

const SingleCreatureText = ({ creature, oneLine  }: { creature: Creature, oneLine?: boolean; }) => {
  const Component = oneLine ? "span" : "div";
  return (
    <Component>
      <strong>{creature.name} (T{creature.tier}).</strong>
      {creature.description}
    </Component>
  );
};
export default SingleCreatureText;