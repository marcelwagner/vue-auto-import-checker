/**
 * Create the logger instance.
 *
 * @param debug - whether to enable debug logging
 */
export function createLogger(debug: boolean): void {
  global.debug = debug;

  const level: 'debug' | 'info' = debug ? 'debug' : 'info';

  global.logger = {
    info: (message: string): void => {
      // oxlint-disable-next-line no-console
      console.log(
        debug ? `${new Date().toLocaleString()} [${level.toUpperCase()}]: ${message}` : message
      );
    },
    debug: (message: string): void => {
      if (debug) {
        // oxlint-disable-next-line no-console
        console.log(`${new Date().toLocaleString()} [${level.toUpperCase()}]: ${message}`);
      }
    }
  };
}

/**
 * Get the current date and time as a string.
 *
 * @returns string - current date and time
 */
export function currentDateTime(): string {
  return new Date().toLocaleString();
}
