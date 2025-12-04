export function writeComponents(componentsList: ComponentTag[]) {
  logger.debug('');
  logger.debug('-----------------------------------');
  logger.debug('Show Components list:');
  logger.debug('');

  if (componentsList.length >= 1) {
    logger.info('');
    logger.info(`Found component${componentsList.length >= 2 ? 's' : ''}:`);
    logger.info('');

    componentsList.forEach(component => logger.info(component.rawTag));

    logger.info('');
    logger.info(`Total : ${componentsList.length}`);
    logger.info('');
  } else {
    logger.info('No components found.');
  }
}
