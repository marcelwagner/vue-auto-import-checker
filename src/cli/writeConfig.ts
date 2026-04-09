import type { VAIC_Config } from '../../types/config.interface.ts';

/**
 * Write the config to the console.
 *
 * @param config - config object
 * @param showResult - whether to show the result stats
 */
export function writeConfig(config: VAIC_Config, showResult: boolean): void {
  if (showResult) {
    logger.info('....................................');
  }

  logger.info('');
  logger.info(`>> Config                         <<`);
  logger.info('');

  if (config.projectPaths) {
    logger.info(`Project Path              : ${config.projectPaths}`);
  }

  if (config.componentsFile) {
    logger.info(`Components File           : ${config.componentsFile}`);
  }

  if (config.knownTags.length >= 1) {
    logger.info(`Known Tags                : ${config.knownTags.join(', ')}`);
  }

  if (config.knownTagsFile) {
    logger.info(`Known Tags File           : ${config.knownTagsFile}`);
  }

  if (config.knownFrameworks.length >= 1) {
    logger.info(`Known Frameworks          : ${config.knownFrameworks.join(', ')}`);
  }

  if (config.negateKnown.length >= 1) {
    logger.info(`Ignored known Frameworks  : ${config.negateKnown.join(', ')}`);
  }

  if (config.cachePath) {
    logger.info(`Cache path                : ${config.cachePath}`);
  }

  if (config.basePath) {
    logger.info(`Base path                 : ${config.basePath}`);
  }

  if (config.debug) {
    logger.info(`Debug mode                : ${config.debug}`);
  }

  logger.info('');
  logger.info('....................................');
  logger.info('');
}
