import { pluralArray } from "./plural.js";
export function writeToolsResult(toolName, toolTags) {
    if (toolTags.length >= 1) {
        logger.info('');
        logger.info(`Found ${toolName} tag${pluralArray(toolTags, '')}:`);
        logger.info('');
        toolTags.forEach((tag) => {
            logger.info(tag);
        });
        logger.info('');
        logger.info(`Found unique tag${pluralArray(toolTags, '')}: ${toolTags.length}`);
        logger.info('');
    }
    else {
        logger.info(`No ${toolName} tags found.`);
    }
}
