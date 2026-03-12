/**
 * Write the list of components to the console.
 * @param componentsList
 */
export function writeComponents(componentsList: string[]) {
  if (componentsList.length >= 1) {
    logger.info('');
    logger.info(`Found component${componentsList.length >= 2 ? 's' : ''}:`);
    logger.info('');

    componentsList.forEach((component: string): void => {
      logger.info(component);
    });

    logger.info('');
    logger.info(`Total : ${componentsList.length}`);
    logger.info('');
  } else {
    logger.info('No components found.');
  }
}
