import { useCallback } from "react";
import styles from "./RewardCreator.module.scss";
import { LOG_LEVEL, Logger } from "../../util/log";
import { useRewardContext } from "../contexts/RewardContext";
import { Button, Form, InputGroup, ListGroup } from "react-bootstrap";

import { initReward } from "../util/reward-calcs";
import { REWARD_TYPE, STAGE } from "../types/reward-types";
import TierRangeSlider from "./TierRangeSlider";
import { SingleRewardText } from "./SingleRewardText";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { findMaxTier } from "../util/find-max-tier";
import RollRandomReward from "./RollRandomReward";

export const logger = Logger(LOG_LEVEL.INFO);

export default function RewardCreator() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  const { rewards, addReward, deleteReward, getRewardById } =
    useRewardContext();
  const navigate = useNavigate();

  const globalMax = findMaxTier(rewards);
  const [shownTierRange, setShownTierRange] = useState<[number, number]>([
    parseInt(params.get("minTier") || "-1"),
    parseInt(params.get("maxTier") || globalMax.toString()),
  ]);
  const [searchText, setSearchText] = useState<string>(
    params.get("search") || ""
  );

  const rewardTypesParam = params.get("rewardTypes");
  const rewardTypesFromUrl = rewardTypesParam
    ? (rewardTypesParam.split(",") as REWARD_TYPE[])
    : [
        REWARD_TYPE.EQUIPMENT,
        REWARD_TYPE.FEATURE,
        REWARD_TYPE.TRINKET,
        REWARD_TYPE.ALLY,
      ];

  const [rewardTypes, setRewardTypes] =
    useState<REWARD_TYPE[]>(rewardTypesFromUrl);

  const handleClickCopy = useCallback(
    (id: string | undefined) => {
      logger.debug("----- handleClickCopy ------", id);
      if (!id) return;
      const rewardToCopy = getRewardById(id);
      const newRewardData = {
        ...rewardToCopy,
        name: rewardToCopy?.name + " Copy",
        id: undefined,
      };
      addReward(newRewardData);
    },
    [addReward, getRewardById]
  );

  const handleChangeRewardType = useCallback(
    (type: REWARD_TYPE, checked: boolean) => {
      setRewardTypes((prevRewardTypes) => {
        let newRewardTypes = [...prevRewardTypes];
        if (checked) {
          newRewardTypes.push(type);
        } else {
          newRewardTypes = prevRewardTypes.filter((t) => t !== type);
        }

        // put reward types in url param
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        params.set("rewardTypes", newRewardTypes.join(","));
        url.search = params.toString();
        window.history.replaceState({}, "", url.toString());

        return newRewardTypes;
      });
    },
    []
  );

  const handleSetSearchText = useCallback((text: string) => {
    setSearchText(text);

    // store in url
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set("search", text);
    url.search = params.toString();
    window.history.replaceState({}, "", url.toString());
  }, []);

  const handleSetShownTierRange = useCallback((range: [number, number]) => {
    setShownTierRange(range);

    // store in url
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set("minTier", range[0].toString());
    params.set("maxTier", range[1].toString());
    url.search = params.toString();
    window.history.replaceState({}, "", url.toString());
  }, []);

  // grab all the rewards but the last one
  const showRewards = rewards
    .filter(
      (options) =>
        !searchText ||
        options.name?.toLowerCase().includes(searchText.toLowerCase())
    )
    // filter rewards in tier range
    .filter((options) => {
      const r = initReward(options);
      if (r.tier < 0 && shownTierRange[0] < 0) return true;
      return r.tier >= shownTierRange[0] && r.tier <= shownTierRange[1];
    })
    // filter rewards by type
    .filter((options) => rewardTypes.includes(initReward(options).type))
    // sort them by tier
    .sort((opt1, opt2) => {
      const r1 = initReward(opt1);
      const r2 = initReward(opt2);
      if (r1.tier < 0) r1.tier = -1;
      if (r2.tier < 0) r2.tier = -1;
      return r1.tier === r2.tier
        ? r1.name.localeCompare(r2.name)
        : r1.tier - r2.tier;
    });

  const handleClickDelete = (id: string | undefined) => {
    if (id) deleteReward(id);
  };

  const handleCreateNew = () => {
    const id = addReward({
      name: "",
      type: REWARD_TYPE.EQUIPMENT,
      stage: STAGE.CHECK,
    });
    // navigate to edit page
    navigate(`/rewards/${id}/edit`);
  };

  return (
    <div className={styles.root}>
      <h1>Reward Creator</h1>
      <TierRangeSlider
        value={shownTierRange}
        setShownTierRange={handleSetShownTierRange}
        max={globalMax}
      />
      <InputGroup className="mb-4">
        <Form.Control
          value={searchText}
          onChange={(e) => handleSetSearchText(e.target.value)}
          placeholder="Search"
        ></Form.Control>
        <InputGroup.Text>🔎</InputGroup.Text>
      </InputGroup>
      <InputGroup className="mb-4">
        <Form.Check
          className={`me-3`}
          checked={rewardTypes.includes(REWARD_TYPE.EQUIPMENT)}
          onChange={(e) =>
            handleChangeRewardType(REWARD_TYPE.EQUIPMENT, e.target.checked)
          }
          label="Equipment"
        />
        <Form.Check
          className={`me-3`}
          checked={rewardTypes.includes(REWARD_TYPE.FEATURE)}
          onChange={(e) =>
            handleChangeRewardType(REWARD_TYPE.FEATURE, e.target.checked)
          }
          label="Feature"
        />
        <Form.Check
          className={`me-3`}
          checked={rewardTypes.includes(REWARD_TYPE.TRINKET)}
          onChange={(e) =>
            handleChangeRewardType(REWARD_TYPE.TRINKET, e.target.checked)
          }
          label="Trinket"
        />
        <Form.Check
          className={`me-3`}
          checked={rewardTypes.includes(REWARD_TYPE.ALLY)}
          onChange={(e) =>
            handleChangeRewardType(REWARD_TYPE.ALLY, e.target.checked)
          }
          label="Ally/Vehicle"
        />
      </InputGroup>
      <span className={`me-2`}>Count: {showRewards.length}</span>
      <Button onClick={handleCreateNew} className="mb-4">
        Create New
      </Button>
      <RollRandomReward showRewards={showRewards} />
      <div className={styles.rewardList}>
        <ListGroup>
          {showRewards.map((options) => {
            const reward = initReward(options);
            const index = rewards.findIndex((opt) => opt === options);
            return (
              <ListGroup.Item className={`d-flex`} key={index}>
                {options.frontImg && (
                  <div
                    className={`${styles.lineImg} me-2 mt-1`}
                    style={{ backgroundImage: `url('${options.frontImg}')` }}
                  ></div>
                )}
                <div className={`flex-grow-1`}>
                  <SingleRewardText
                    reward={reward}
                    oneLine={true}
                    showPrice={true}
                  />
                </div>
                <div className={`flex-shrink-1 d-flex align-items-center`}>
                  <a href={`/rewards/${options.id}/edit`} className="me-2">
                    <Button size="sm" className="me-2">
                      Load
                    </Button>
                  </a>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleClickCopy(options.id)}
                  >
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleClickDelete(options.id)}
                  >
                    Delete
                  </Button>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>
    </div>
  );
}
