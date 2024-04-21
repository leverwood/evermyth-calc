export function printPercent(num: number){
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  });
  return formatter.format(num * 100) + "%";
}