import { logger } from '../utils/index.ts';
import { userConfig } from '../config/index.ts';

/**
 * Write the config to the console.
 */
export function writeConfig(
  commanderOptions: CommanderInit | null = null
): void {
  if (!commanderOptions?.showConfig) {
    if (userConfig.showResult) {
      logger.info('....................................');
    }

    logger.info('');
    logger.info(`>> Config                         <<`);
    logger.info('');
  }

  logger.info('Commander options:');
  logger.info(JSON.stringify(commanderOptions, null, 2));
  logger.info('');
  logger.info('Config options:');
  logger.info(JSON.stringify(userConfig, null, 2));

  if (!commanderOptions?.showConfig) {
    logger.debug('');
    logger.debug('....................................');
    logger.debug('');
  }
}
