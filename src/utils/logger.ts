import { userConfig } from '../config/index.ts';

/**
 * Create the logger instance.
 */
class Logger {
  log: { info: string[]; debug: string[] };

  constructor() {
    this.log = { info: [], debug: [] };
  }

  get level(): 'debug' | 'info' {
    return userConfig.debug ? 'debug' : 'info';
  }

  get upperCaseLevel(): 'DEBUG' | 'INFO' {
    return this.level.toUpperCase() as 'DEBUG' | 'INFO';
  }

  info(message: string): void {
    if (userConfig.outputFormat !== 'json') {
      if (!userConfig.quiet) {
        // oxlint-disable-next-line no-console
        console.log(
          userConfig.debug
            ? `${new Date().toLocaleString()} [${this.upperCaseLevel}]: ${message}`
            : message
        );
      }
    } else {
      if (userConfig.debug) {
        this.log.debug.push(
          `${new Date().toLocaleString()} [${this.upperCaseLevel}]: ${message}`
        );
      } else {
        this.log.info.push(message);
      }
    }
  }
  debug(message: string): void {
    if (userConfig.debug) {
      if (userConfig.outputFormat !== 'json') {
        // oxlint-disable-next-line no-console
        console.log(
          `${new Date().toLocaleString()} [${this.upperCaseLevel}]: ${message}`
        );
      } else {
        this.log.debug.push(
          `${new Date().toLocaleString()} [${this.upperCaseLevel}]: ${message}`
        );
      }
    }
  }
  exit(message: string, json: Record<string, unknown> = {}): void {
    if (userConfig.outputFormat === 'json') {
      const output = {
        ...json,
        ...(!userConfig.debug && this.log.info.length >= 1
          ? { info: this.log.info }
          : {}),
        exitMessage: message
      };
      // oxlint-disable-next-line no-console
      console.log(JSON.stringify(output, null, 2));
    } else {
      // oxlint-disable-next-line no-console
      console.log(message);
    }
  }
}

export const logger = new Logger();
