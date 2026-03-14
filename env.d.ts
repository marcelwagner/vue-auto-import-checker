// Extend the NodeJS global type to include config
import type { Logger } from 'winston';

declare global {
  var debug: boolean;
  var logger: Logger;
  var stats: Stats;
  var quiet: boolean;
}
