import { Button } from "react-bootstrap";
import { RewardData } from "../../rewards/types/reward-types";
import { Creature, ChangeValueFunc } from "../types/creature-types";
import { useRewardContext } from "../../rewards/contexts/RewardContext";
import { useEffect, useState } from "react";
import { SingleRewardText } from "../../rewards/components/SingleRewardText";
import { initReward } from "../../rewards/util/reward-calcs";

export function AddCreatureReward({
  creature,
  changeValue,
  adding = true,
  searchString,
}: {
  creature: Creature;
  changeValue: ChangeValueFunc;
  adding?: boolean;
  searchString?: string;
}) {
  const { rewards } = useRewardContext();
  const { getRewardById } = useRewardContext();
  const [list, setList] = useState<RewardData[]>([]);

  useEffect(() => {
    let list = adding
      ? rewards.filter((reward) => !creature.rewards.includes(reward.id || ""))
      : (creature.rewards
          .map((id) => getRewardById(id))
          .filter((reward) => reward) as RewardData[]);
    list = adding
      ? list.filter((reward) =>
          reward.name?.toLowerCase().includes(searchString?.toLowerCase() || "")
        )
      : list;
    setList(list);
  }, [adding, rewards, creature, getRewardById, searchString]);

  return (
    <>
      {!!list.length && <h3 className={"mt-5"}>Rewards</h3>}
      <ul>
        {list
          .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
          .map((rewardData, index) => {
            // if it's a blank reward, don't show it
            if (adding && Object.keys(rewardData).length === 0) return null;

            return (
              <li className={`d-flex align-items-center`} key={index}>
                <Button
                  size="sm"
                  className={`me-2`}
                  variant={`${adding ? "secondary" : "outline-danger"}`}
                  onClick={() =>
                    changeValue(
                      adding ? "addReward" : "deleteReward",
                      rewardData.id
                    )
                  }
                >
                  {adding ? "+" : "x"}
                </Button>
                <SingleRewardText
                  reward={initReward(rewardData)}
                  oneLine={true}
                  isCreature={true}
                />
              </li>
            );
          })}
      </ul>
    </>
  );
}
