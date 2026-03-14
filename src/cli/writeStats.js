import { pluralArray, pluralLength } from "./plural.js";
export function writeStats({ stats, filesList, tagsList, uniqueTagsList, showResult, kafka }) {
    const duration = stats.endTime - stats.startTime;
    const durationInSeconds = duration / 1000;
    const durationAboveSecond = durationInSeconds >= 1;
    const durationNumber = durationAboveSecond ? durationInSeconds : duration;
    const durationUnit = durationAboveSecond ? 's' : 'ms';
    if (showResult) {
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
    logger.info(`Duration                  : ${durationNumber}${durationUnit}`);
    logger.info('');
    logger.info('....................................');
    logger.info('');
    logger.info(`>> Unique ${kafka ? '' : 'unknown '}tag${pluralArray(uniqueTagsList, ' ', 's ')}found${kafka ? '        ' : ''}      <<`);
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
