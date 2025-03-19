import { useParams } from "react-router-dom";
import { EditCreature } from "./EditCreature";
import { CreatureProvider } from "../contexts/CreatureContext";

function EditCreaturePage() {
  const { id } = useParams<{ id?: string }>();

  if (!id) return <p>404</p>;

  return (
    <CreatureProvider>
      <EditCreature id={id} />
    </CreatureProvider>
  );
}

export default EditCreaturePage;
