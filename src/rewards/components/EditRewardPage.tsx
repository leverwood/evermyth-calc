import { useParams } from "react-router-dom";
import { EditReward } from "./EditReward";
import { RewardProvider } from "../contexts/RewardContext";

function RewardPage() {
  const { id } = useParams<{ id?: string }>();

  if (!id) return <p>404</p>;

  return (
    <RewardProvider>
      <EditReward id={id} />
    </RewardProvider>
  );
}

export default RewardPage;
