import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import styles from "./TierRangeSlider.module.scss";

export default function TierRangeSlider({
  min = 0,
  max = 5,
}: {
  min: number;
  max: number;
}) {
  const marks: {
    [key: number]: string;
  } = {};
  for (let i = min; i <= max; i++) {
    marks[i] = `T${i}`;
  }

  return (
    <div className={styles.root}>
      <span className={styles.sliderLabel}>Tier</span>
      <Slider
        range
        min={min}
        max={max}
        marks={marks}
        step={null}
        defaultValue={[0, 5]}
        onChangeComplete={(value) => console.log(value)}
      />
    </div>
  );
}
