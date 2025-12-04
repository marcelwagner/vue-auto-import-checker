// Extend the NodeJS global type to include config
import { Logger } from 'winston';

declare global {
  // eslint-disable-next-line no-var
  var debug: boolean;
  var logger: Logger;
}
