import { pluralArray } from './plural.ts';

/**
 * Write the tool result to the console.
 *
 * @param toolName - name of the tool
 * @param toolTags - list of tags found by the tool
 */
export function writeToolsResult(toolName: string, toolTags: string[]): void {
  if (toolTags.length >= 1) {
    logger.info('');
    logger.info(`Found ${toolName} tag${pluralArray(toolTags, '')}:`);
    logger.info('');

    toolTags.forEach((tag: string): void => {
      logger.info(tag);
    });

    logger.info('');
    logger.info(`Found unique tag${pluralArray(toolTags, '')}: ${toolTags.length}`);
    logger.info('');
  } else {
    logger.info(`No ${toolName} tags found.`);
  }
}
