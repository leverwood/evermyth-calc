import styles from "./Price.module.scss";

function convertPrice(cp: number, tier?: number): string {
  let result = `${cp} cp`;

  if (tier === undefined) {
    if (cp > 2500 && cp % 1000 === 0) {
      result = `${cp / 1000} pp`;
    } else if (cp > 250 && cp % 100 === 0) {
      result = `${cp / 100} gp`;
    } else if (cp > 25 && cp % 10 === 0) {
      result = `${cp / 10} sp`;
    }
  } else {
    if (tier >= 3 && cp % 1000 === 0) {
      result = `${cp / 1000} pp`;
    } else if (tier === 2 && cp % 100 === 0) {
      result = `${cp / 100} gp`;
    } else if (tier === 1 && cp % 10 === 0) {
      result = `${cp / 10} sp`;
    }
  }

  return result;
}

export default function Price({
  cp = 0,
  tier = 0,
}: {
  cp?: number;
  tier?: number;
}) {
  if (cp === 0) {
    return null;
  }
  return (
    <span className={`${styles.price} me-2`}>
      &nbsp;{convertPrice(cp, tier)} &nbsp;
    </span>
  );
}
