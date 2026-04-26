import { userConfig } from "../config/index.js";
import { getUniqueFromList, logger, statistics } from "../utils/index.js";
import { getDuration, pluralArray, pluralLength } from "./index.js";
export function writeStats(tagsList) {
    statistics.end();
    const stats = statistics.getStats();
    const duration = getDuration();
    const uniqueTagsList = getUniqueFromList(tagsList.map((tag) => tag.tagName));
    const filesList = getUniqueFromList(tagsList.map((tag) => tag.file));
    if (userConfig.outputFormat === 'text') {
        if (userConfig.showResult) {
            logger.info('');
            logger.info(`>> Result stats                   <<`);
            logger.info('');
            logger.info(`Tag${pluralArray(tagsList)}                      : ${tagsList.length}`);
            logger.info(`Unique Tag${pluralArray(uniqueTagsList)}               : ${uniqueTagsList.length}`);
            logger.info(`File${pluralArray(filesList)}                     : ${filesList.length}`);
            logger.info('');
            logger.info('....................................');
            logger.info('');
        }
        logger.info(`>> Scan stats                     <<`);
        logger.info('');
        logger.info(`Directorie${pluralLength(stats.dirCounter)}               : ${stats.dirCounter}`);
        logger.info(`File${pluralLength(stats.fileCounter)}                     : ${stats.fileCounter}`);
        logger.info(`Template file${pluralLength(stats.templateFiles)}            : ${stats.templateFiles}`);
        logger.info(`Duration                  : ${duration}`);
        logger.info('');
        logger.info('....................................');
        logger.info('');
        logger.info(`>> Unique ${userConfig.kafka ? '' : 'unknown '}tag${pluralArray(uniqueTagsList, ' ', 's ')}found${userConfig.kafka ? '        ' : ''}      <<`);
        logger.info('');
        uniqueTagsList.forEach((tag) => {
            logger.info(` - ${tag}`);
        });
        logger.info('');
        logger.info(`Total                     : ${uniqueTagsList.length}`);
        logger.info('');
        logger.info('....................................');
        logger.info('');
    }
    else if (userConfig.outputFormat === 'md') {
        logger.info(`# Stats`);
        if (userConfig.showResult) {
            logger.info(`## Result stats`);
            logger.info(`Tag${pluralArray(tagsList)}: ${tagsList.length} \\`);
            logger.info(`Unique Tag${pluralArray(uniqueTagsList)}: ${uniqueTagsList.length} \\`);
            logger.info(`File${pluralArray(filesList)}: ${filesList.length}`);
        }
        logger.info(`## Scan stats`);
        logger.info(`Directorie${pluralLength(stats.dirCounter)}: ${stats.dirCounter} \\`);
        logger.info(`File${pluralLength(stats.fileCounter)}: ${stats.fileCounter} \\`);
        logger.info(`Template file${pluralLength(stats.templateFiles)}: ${stats.templateFiles} \\`);
        logger.info(`Duration: ${duration}`);
        logger.info('');
        logger.info(`Unique ${userConfig.kafka ? '' : 'unknown '}tag${pluralArray(uniqueTagsList, ' ', 's ')}found`);
        uniqueTagsList.forEach((tag) => {
            logger.info(` - ${tag}`);
        });
        logger.info('');
        logger.info(`Total: ${uniqueTagsList.length}`);
        logger.info('');
    }
}
