import html2canvas from "html2canvas";

import styles from "./RewardCard.module.scss";
import { initReward } from "../util/reward-calcs";
import { RewardData, REWARD_TYPE } from "../types/reward-types";
import { SingleRewardText } from "./SingleRewardText";
import DynamicText from "../../components/DynamicText";
import { useRef } from "react";
import { Button } from "react-bootstrap";

const MAX_FONT_SIZE = 15;

export function RewardCard({ rewardData }: { rewardData: RewardData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);

  if (Object.keys(rewardData).length === 0) return null;

  const reward = initReward(rewardData);

  const handleScreenshot = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current);
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${reward.name}-back.png`;
      link.click();
    }
    if (frontRef.current) {
      const canvas = await html2canvas(frontRef.current, {
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${reward.name}-front.png`;
      link.click();
    }
  };

  return (
    <>
      {rewardData.frontImg && (
        <div className={`mb-3 `} ref={frontRef}>
          <div
            className={`${styles.front} ${
              rewardData.padImage ? styles.padImage : ""
            }`}
          >
            <img
              className={`${styles.frontImage} ${
                rewardData.stretchImgY ? styles.stretchImgY : ""
              }`}
              src={rewardData.frontImg}
              alt={reward.name}
            />
          </div>
        </div>
      )}

      <div
        className={`mb-3 ${styles.card} ${styles.cardMultiReward}`}
        ref={cardRef}
      >
        <header className={styles.cardHeader}>{reward.name}</header>
        {
          <div className={`${styles.cardBody}`}>
            <DynamicText
              className={styles.scrollBlock}
              maxFontSize={MAX_FONT_SIZE}
            >
              {
                <>
                  <div>
                    <SingleRewardText
                      reward={reward}
                      noTitle={true}
                      noType={true}
                      noTier={true}
                    />
                  </div>
                  {reward.upcast ? (
                    <p>
                      <SingleRewardText
                        reward={initReward(reward.upcast)}
                        noType={true}
                        noTier={true}
                        upcast={true}
                      />
                    </p>
                  ) : null}
                </>
              }
            </DynamicText>
          </div>
        }
        <footer
          className={`${styles.cardFooter} ${
            styles[reward.type || "".toLocaleLowerCase()]
          }`}
        >
          <div>
            {reward.type !== REWARD_TYPE.TRINKET && (
              <span className={styles.cardTier}>
                tier {Math.max(reward.tier, 0)}{" "}
              </span>
            )}
            <span className={`${styles.cardType}`}>
              {reward.type || "EQUIPMENT"}
            </span>{" "}
          </div>
        </footer>
      </div>
      <Button
        className={`${styles.screenshotButton}`}
        onClick={handleScreenshot}
        size="sm"
        variant="dark"
      >
        Take Screenshots
      </Button>
    </>
  );
}
