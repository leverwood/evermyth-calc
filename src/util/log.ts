export const LOG_LEVEL = {
  VERBOSE: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

export function Logger(initialLevel: number = LOG_LEVEL.INFO){
  let level = initialLevel;
  return {
    setLevel: (newLevel: number) => level = newLevel,
    debug: level <= LOG_LEVEL.VERBOSE ? console.debug.bind(console) : () => {},
    log: level <= LOG_LEVEL.INFO ? console.log.bind(console) : () => {},
    warn: level <= LOG_LEVEL.WARN ? console.warn.bind(console) : () => {},
    error: level <= LOG_LEVEL.ERROR ? console.error.bind(console) : () => {},
  }
}