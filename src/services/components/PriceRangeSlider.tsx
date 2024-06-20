import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function PriceRangeSlider({
  value = [0, 5],
  max = 5,
  setPriceRange,
}: {
  value: [number, number];
  max: number;
  setPriceRange: (value: [number, number]) => void;
}) {
  const marks: {
    [key: number]: string;
  } = {};
  for (let i = 0; i <= max; i++) {
    marks[i] = `${i}`;
  }

  return (
    <div>
      <span>Price</span>
      <Slider
        range
        min={0}
        max={max}
        marks={marks}
        step={null}
        defaultValue={[0, max]}
        onChangeComplete={(value) =>
          setPriceRange(
            typeof value === "number" ? [value, value] : [value[0], value[1]]
          )
        }
      />
    </div>
  );
}
