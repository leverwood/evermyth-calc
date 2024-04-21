import { getRandomNum } from "../../util/math";

export interface AutoResultOptions {
  [key: string]: {
    autoWin: number | null;
    autoFail: number | null;
  };
}

export const autoResultDefault: AutoResultOptions = {
  d20: {
    autoWin: 20,
    autoFail: 1,
  },
  d12: {
    autoWin: 12,
    autoFail: null,
  },
  d10: {
    autoWin: 10,
    autoFail: null,
  },
  d8: {
    autoWin: 8,
    autoFail: null,
  },
};

export interface AnyDiceResult {
  /** The total number that was rolled of all the dice added */
  total: number;
  /** The percentage chance to get this result */
  percent: number;
  autoWin: boolean;
  autoFail: boolean;
  dice: string[];
}

export interface TotalSumPercentages {
  formula: string;
  result: AnyDiceResult[];
}

export interface PCRoll {
  total: number;
  autoWin: boolean;
  autoFail: boolean;
  dice: string[];
  formula: string;
}

export const isMiss = (roll: PCRoll, needed: number) => (roll.total < needed && !roll.autoWin) || roll.autoFail;

// 3d6
export function diceFormula(
  numDice: number,
  sides: number,
  explode = 0,
  autoResults = autoResultDefault
): TotalSumPercentages {
  if (numDice === 1) {
    const result: AnyDiceResult[] = [];
    for (let i = 1; i <= sides; i++) {
      // crit, explode
      if (explode && i === sides) {
        const explodedDice = diceFormula(1, sides, explode - 1);
        result.push(
          ...explodedDice.result.map((d) => ({
            total: i + d.total,
            percent: (1 / sides) * d.percent,
            autoWin: autoResults[`d${sides}`]?.autoWin === i,
            autoFail: autoResults[`d${sides}`]?.autoFail === i,
            dice: [`1d${sides} (${i} 💥)`, ...d.dice]
          }))
        );
      } 
      // fail
      else {
        const autoNums = autoResults[`d${sides}`];
        result.push({
          total: i,
          percent: 1 / sides,
          autoWin: !!(autoNums?.autoWin && autoNums?.autoWin <= i),
          autoFail: !!(autoNums?.autoFail && autoNums.autoFail >= i),
          dice: [`1d${sides} (${i})`],
        });
      }
    }
    return {
      formula: `${numDice}d${sides}`,
      result,
    };
  }

  // multiply me by recursive call
  const singleResult = diceFormula(1, sides, explode);
  return sumResults(singleResult, diceFormula(numDice - 1, sides, explode));
}

// 1d20 + 1d4
export function sumResults(
  a: TotalSumPercentages,
  b: TotalSumPercentages
): TotalSumPercentages {
  const result: AnyDiceResult[] = [];
  for (let i = 0; i < a.result.length; i++) {
    for (let j = 0; j < b.result.length; j++) {
      let total = a.result[i].total + b.result[j].total;
      if (a.result[i].total === 0 || b.result[j].total === 0) {
        total = 0;
      }
      const percent = a.result[i].percent * b.result[j].percent;

      // if the total already exists, increase the percent
      const existing = result.find((r) => r.total === total);
      if (existing) {
        existing.percent += percent;
      } else {
        result.push({ 
          total, 
          percent,
          autoWin: a.result[i].autoWin || b.result[j].autoWin,
          autoFail: a.result[i].autoFail || b.result[j].autoFail,
          dice: [...a.result[i].dice, ...b.result[j].dice],
        });
      }
    }
  }

  return {
    formula: `${a.formula} + ${b.formula}`,
    result,
  };
}

// returns the percentage chance to roll at least num
// TODO: The way TotalSumPercentages is structured, it doesn't track autoWin/autoFail
export function atLeast(sums: TotalSumPercentages, num: number) {
  return sums.result
    .filter((r) => (r.total >= num))
    .reduce((acc, r) => acc + r.percent, 0);
}

export interface DiceHandful {
  numDice: number;
  sides: number;
  subtract?: boolean;
}

export function rollDice(handfuls: DiceHandful[], mod: number = 0, autoResult = autoResultDefault, explode = true): PCRoll {
  let total = 0;
  const diceResults: string[] = [];
  let autoWin = false, autoFail = false;

  // flatten the handfuls into individual dice
  const individualDice = [];
  for (const handful of handfuls) {
    const sides = handful.subtract ? -handful.sides : handful.sides;
    individualDice.push(...new Array(handful.numDice).fill(sides));
  }

  for(const sides of individualDice) {
    const roll = sides < 0 ? getRandomNum(sides, -1) : getRandomNum(1, sides);
    total += roll;
    
    // explode
    if(roll === sides && explode) {
      individualDice.push(sides);
      diceResults.push(`d${sides}(${roll}💥)`);
    }
      
    else 
      diceResults.push(`d${sides}(${roll})`);
    const autoFailNum = autoResult[`d${sides}`]?.autoFail;
    if (autoFailNum && roll <= autoFailNum)
      autoFail = true;
    const autoWinNum = autoResult[`d${sides}`]?.autoWin;
    if (autoWinNum && roll >= autoWinNum)
      autoWin = true;
  }

  total += mod;
  diceResults.push(`${mod}`);

  return {
    total,
    autoWin,
    autoFail,
    dice: diceResults,
    formula: handfuls.map((h) => `${h.numDice}d${h.sides}`).join(" + "),
  }
}

export function addMod(sums: TotalSumPercentages, mod: number): TotalSumPercentages {
  const result = sums.result.map((r) => ({ 
    total: (r.total === 0) ? 0 : r.total + mod, 
    percent: r.percent,
    autoWin: r.autoWin,
    autoFail: r.autoFail,
    dice: [...r.dice],
  }));
  return {
    formula: `${sums.formula} + ${mod}`,
    result
  }
}


// no advantage in this system
export function advantage(
  sides: number,
  numDice = 2,
  autoDefault = autoResultDefault
): TotalSumPercentages {
  const results: AnyDiceResult[] = [];

  // Calculate the probability for each possible result
  for (let result = 2; result <= sides + 1; result++) {
    // Probability of all dice rolling less than the current result
    const allLessProbability = Math.pow((result - 1) / sides, numDice);
    // Probability of all dice rolling less than the previous result
    const allLessPreviousProbability =
      result === 1 ? 0 : Math.pow((result - 2) / sides, numDice);
    // Probability of the highest roll being exactly the current result
    const exactProbability = allLessProbability - allLessPreviousProbability;
    results.push({
      total: result - 1,
      percent: exactProbability,
      autoWin: autoDefault[`d${sides}`]?.autoWin === result - 1,
      autoFail: autoDefault[`d${sides}`]?.autoFail === result - 1,
      dice: [`${numDice}d${sides}ADV (${result - 1})`],
    });
  }

  return {
    formula: `${numDice}d${sides}ADV`,
    result: results,
  };
}