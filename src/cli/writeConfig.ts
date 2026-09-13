import { logger } from '../utils/index.ts';
import { userConfig } from '../config/index.ts';

/**
 * Write the config to the console.
 */
export function writeConfig(
  commanderOptions: CommanderConfig | null = null
): void {
  const showConfig = commanderOptions?.showConfig ?? userConfig?.showConfig;

  if (!showConfig) {
    if (userConfig.showResult) {
      logger.info('....................................');
    }

    logger.info('');
    logger.info(`>> Config                         <<`);
    logger.info('');
  }

  if (commanderOptions) {
    logger.info('Commander options:');
    logger.info(JSON.stringify(commanderOptions, null, 2));
  } else {
    logger.info('Config options:');
    logger.info(JSON.stringify(userConfig, null, 2));
  }

  if (!showConfig) {
    logger.debug('');
    logger.debug('....................................');
    logger.debug('');
  }
}
