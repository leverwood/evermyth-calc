import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import styles from "./TierRangeSlider.module.scss";

export default function TierRangeSlider({
  value = [0, 5],
  max = 5,
  setShownTierRange,
}: {
  value: [number, number];
  max: number;
  setShownTierRange: (value: [number, number]) => void;
}) {
  const marks: {
    [key: number]: string;
  } = {};
  for (let i = -1; i <= max; i++) {
    marks[i] = `T${i < 0 ? "<0" : i}`;
  }

  return (
    <div className={styles.root}>
      <span className={styles.sliderLabel}>Tier</span>
      <Slider
        range
        min={-1}
        max={max}
        marks={marks}
        step={null}
        defaultValue={[-1, max]}
        onChangeComplete={(value) =>
          setShownTierRange(
            typeof value === "number" ? [value, value] : [value[0], value[1]]
          )
        }
      />
    </div>
  );
}
