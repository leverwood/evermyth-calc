type DiceFormula = {
  numDice: number;
  dieSize: number;
  remainder: number;
};

const numDicePairs = (numDice: number) => Math.floor(numDice / 2);

const plusOrMinus = (num: number) => (num >= 0 ? "+" : "-");

export const printModifier = (mod: number): string => {
  return `${plusOrMinus(mod)}${Math.abs(mod)}`;
};

export function getAllDiceFormulas(
  min: number,
  max: number,
  dieSizes: number[]
): { [key: string]: DiceFormula[] } {
  let allFormulas: { [key: number]: DiceFormula[] } = {};
  // loop min to max
  for (let i = min; i <= max; i++) {
    const avg = i;
    allFormulas[avg] = [];
    // only use die sizes that can fit within the average
    const limitedDieSizes = dieSizes.filter((dieSize) => dieSize <= avg * 2);
    // loop through each valid die size
    for (let j = 0; j < limitedDieSizes.length; j++) {
      const formula = getDiceFormulaForSize(avg, limitedDieSizes[j]);
      allFormulas[avg].push(formula);
    }
  }
  return allFormulas;
}

/** finds the die size that would be best for an average */
export const findDieSize = (avg: number): number | undefined => {
  // if (avg === 13) debugger;
  if (avg <= 2) return 4;
  const dieSizes = [4, 6, 8, 10, 12];
  let dieSize = 4;
  let numDice;
  for (let i = 0; i < dieSizes.length; i++) {
    dieSize = dieSizes[i];
    numDice = Math.floor(avg / (dieSizes[i] / 2));
    const negativeRemainder =
      numDice * (dieSize / 2) + numDicePairs(numDice) - avg > 0;
    if (numDice !== 1 && numDice <= dieSize && !negativeRemainder) {
      break;
    }
  }

  return Math.min(dieSize, avg * 2);
};

export function flatToRolled(avg: number): DiceFormula {
  return getDiceFormulaForSize(avg, findDieSize(avg) || 4);
}

export function flatToRolledPrint(avg: number): string {
  let formula: DiceFormula = getDiceFormulaForSize(avg, findDieSize(avg) || 4);
  return printDiceFormula(formula) + ` (${avg})`;
}

export function getDiceFormulaForSize(
  average: number,
  dieSize: number
): DiceFormula {
  // the average roll of the die size
  const averageOfDieSize = dieSize / 2;

  // If no die size less than the average is found, choose the smallest die size
  if (averageOfDieSize > average) {
    return {
      remainder: average,
      numDice: 0,
      dieSize,
    };
  }

  // Get number of dice: divide the die size by 2 and divide the average by this number, round down
  let numDice = Math.floor(average / averageOfDieSize);
  let currentAverage = numDice * averageOfDieSize + numDicePairs(numDice);

  // Calculate the remainder
  let remainder = average - currentAverage;

  // decrease the numDie if negative remainder
  if (remainder < 0) {
    numDice--;
    currentAverage = numDice * averageOfDieSize + numDicePairs(numDice);
    remainder = average - currentAverage;
  }

  // Return the final dice formula
  if (calcAverageRoll({ numDice, dieSize, remainder }) !== average)
    console.error(`Invalid average: ${average} for d${dieSize}`);
  return {
    numDice,
    dieSize,
    remainder,
  };
}

export function printDiceFormula({
  remainder,
  dieSize,
  numDice,
}: DiceFormula): string {
  const printDice = numDice !== 0 ? `${numDice}d${dieSize}` : "";
  const printRemainder =
    remainder !== 0 ? ` ${plusOrMinus(remainder)} ${Math.abs(remainder)}` : "";
  return `${printDice}${printRemainder}`;
}

export function printAllFormulaData(formula: DiceFormula): string {
  return `${printDiceFormula(formula)} (${calcAverageRoll(
    formula
  )}) [max ${findHighestLikely(formula, 0.05)}]`;
}

export function parseDiceFormula(str: string): DiceFormula {
  // Regular expression for parsing dice formulas
  const regex = /(\d*)d(\d+)([+-]\d+)?/;

  // Match the formula against the regular expression
  const match = str.match(regex);

  // Check if the formula is valid
  if (!match) {
    throw new Error("Invalid dice formula");
  }

  // Extract the parts of the dice formula
  const numDice = match[1] ? parseInt(match[1]) : 1; // If no number is given before "d", assume 1
  const dieSize = parseInt(match[2]);
  const remainder = match[3] ? parseInt(match[3]) : 0; // If no remainder is given, assume 0

  return { numDice, dieSize, remainder };
}

export function maximumRoll({ numDice, dieSize, remainder }: DiceFormula) {
  return numDice * dieSize + remainder;
}

export function minimumRoll({ numDice, remainder }: DiceFormula) {
  return numDice + remainder;
}

function likelyToRoll(
  { numDice, dieSize, remainder }: DiceFormula,
  target: number
) {
  const targetDiceTotal = target - remainder;

  const dp = Array(numDice + 1)
    .fill(0)
    .map(() => Array(targetDiceTotal + 1).fill(0));

  dp[0][0] = 1; // only one way to roll zero dice for a total of zero

  for (let i = 1; i <= numDice; i++) {
    for (let j = 0; j <= targetDiceTotal; j++) {
      for (let k = 1; k <= dieSize; k++) {
        if (j >= k) {
          dp[i][j] += dp[i - 1][j - k];
        }
      }
    }
  }

  const totalOutcomes = Math.pow(dieSize, numDice);
  const successfulOutcomes = dp[numDice][targetDiceTotal];
  return successfulOutcomes / totalOutcomes;
}

export function calcAverageRoll({ numDice, dieSize, remainder }: DiceFormula) {
  return Math.floor(((dieSize + 1) / 2) * numDice) + remainder;
}

/** From 0-1 */
type Percentage = number;

export function standardDeviation({ numDice, dieSize }: DiceFormula) {
  // The variance of a single roll is (numSides^2 - 1) / 12
  let variance = (numDice * (Math.pow(dieSize, 2) - 1)) / 12;

  // The standard deviation is the square root of the variance
  let standardDeviation = Math.sqrt(variance);

  return standardDeviation;
}

export function findHighestLikely(formula: DiceFormula, chance: Percentage) {
  // Start from the maximum possible total
  let total = maximumRoll(formula);

  while (total >= formula.numDice) {
    let probability = likelyToRoll(formula, total);

    if (probability >= chance) {
      return total;
    }

    // Try the next lower total
    total--;
  }

  // No total has at least the desired probability, just return the average
  return calcAverageRoll(formula);
}
