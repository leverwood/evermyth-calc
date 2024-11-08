import { useState } from "react";
import { Button } from "react-bootstrap";

import { RewardData } from "../types/reward-types";
import { getRandomNum } from "../../util/math";
import { SingleRewardText } from "./SingleRewardText";
import { initReward } from "../util/reward-calcs";

interface RollRandomRewardProps {
  showRewards: RewardData[];
}

const RollRandomReward = ({ showRewards }: RollRandomRewardProps) => {
  const [randomReward, setRandomReward] = useState<RewardData | null>(null);

  const handleRollRandom = () => {
    const randomIndex = getRandomNum(0, showRewards.length - 1);
    setRandomReward(showRewards[randomIndex]);
  };

  return (
    <span>
      <Button onClick={handleRollRandom} className="mb-4 ms-2">
        Roll
      </Button>
      {randomReward ? (
        <p>
          <a
            className={"ms-3"}
            style={{ color: "inherit", textDecoration: "none" }}
            href={`/rewards/${randomReward.id}/edit`}
          >
            <SingleRewardText
              reward={initReward(randomReward)}
              oneLine={true}
              showPrice={true}
            />
          </a>
        </p>
      ) : null}
    </span>
  );
};

export default RollRandomReward;
