export function writeToolsResult(toolName: string, toolTags: string[]) {
  logger.debug('');
  logger.debug('-----------------------------------');
  logger.debug('Show Tool Result:');
  logger.debug('');

  if (toolTags.length >= 1) {
    logger.info('');
    logger.info(`Found ${toolName} tag${toolTags.length ? 's' : ''}:`);
    logger.info('');

    toolTags.forEach(tag => logger.info(tag));

    logger.info('');
    logger.info(`Found ${toolName} tag${toolTags.length ? 's' : ''}: ${toolTags.length}`);
    logger.info('');
  } else {
    logger.info(`No ${toolName} tags found.`);
  }
}
