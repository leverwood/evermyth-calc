import styles from "./RewardCreator.module.scss";
import { initReward } from "../util/reward-calcs";
import { RewardData, ChangeValueFunc } from "../types/reward-types";
import { SingleRewardText } from "./SingleRewardText";
import { isSameReward } from "../util/reward-calcs";
import { Button } from "react-bootstrap";

export function CombinedReward({
  selectedOptions,
  savedRewards,
  changeValue,
  adding = true,
  searchString,
}: {
  selectedOptions: RewardData;
  savedRewards: RewardData[];
  changeValue: ChangeValueFunc;
  adding?: boolean;
  searchString?: string;
}) {
  const multiRewards = selectedOptions.multiRewards || [];
  let list = adding ? savedRewards : multiRewards;
  list = adding
    ? list.filter((reward) =>
        reward.name?.toLowerCase().includes(searchString?.toLowerCase() || "")
      )
    : list;

  return (
    <>
      {!!list.length && (
        <h3 className={"mt-5"}>Combine{!adding ? "d" : ""} rewards</h3>
      )}
      <ul className={styles.combinedRewardsList}>
        {list
          .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
          .map((rewardData, index) => {
            // Adding: if it is already included, don't show it
            if (adding && isSameReward(selectedOptions, rewardData))
              return null;

            // ignore final reward, which is the currently edited one
            // if (adding && index === list.length - 1) return null;

            // if it's a blank reward, don't show it
            if (adding && Object.keys(rewardData).length === 0) return null;

            // TODO: set display names for rewards
            return (
              <li
                className={`${styles.combinedRewardItem} d-flex align-items-center`}
                key={index}
              >
                <Button
                  size="sm"
                  className={`me-2`}
                  variant={`${adding ? "secondary" : "outline-danger"}`}
                  onClick={() =>
                    changeValue(
                      adding ? "addMultiReward" : "deleteMultiReward",
                      rewardData
                    )
                  }
                >
                  {adding ? "+" : "x"}
                </Button>
                <SingleRewardText
                  className={styles.combinedRewardText}
                  reward={initReward(rewardData)}
                  oneLine={true}
                />
              </li>
            );
          })}
      </ul>
    </>
  );
}
