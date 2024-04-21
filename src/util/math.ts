import { LOG_LEVEL, Logger } from "./log";

const logger = Logger(LOG_LEVEL.INFO);

// get a random number from min to max
export function getRandomNum(min: number, max: number): number {
   // Ensure the minimum is less than the maximum and both are integers
    if (min > max) {
       logger.error("Minimum value must be less than the maximum value.");
    }
    // Math.random() returns a value from 0 (inclusive) to 1 (exclusive)
    // Math.floor() rounds down to the nearest whole number
    return Math.floor(Math.random() * (max - min + 1) + min);
}