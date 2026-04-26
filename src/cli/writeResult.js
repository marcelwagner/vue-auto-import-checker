import { userConfig } from "../config/index.js";
import { logger } from "../utils/index.js";
import { getLineIndexAsString, pluralArray } from "./index.js";
export function writeResult(tags) {
    let currentFile = '';
    if (userConfig.outputFormat === 'text') {
        logger.info('');
        logger.info(`>> Result                         <<`);
        tags.forEach(({ file, line, tagName, lines, knownSource }) => {
            logger.info('');
            if (currentFile !== file) {
                logger.info('----------------------');
                logger.info('');
                logger.info(`File path   : ${file}`);
                currentFile = file;
            }
            else {
                logger.info('-----------');
            }
            logger.info('');
            lines.forEach(({ text, index }) => logger.info(`${getLineIndexAsString(index, lines[lines.length - 1].index)}: ${text}`));
            logger.info('');
            logger.info(`Line number: ${line}`);
            logger.info(`Tag name    : ${tagName}`);
            const isImport = knownSource.every(({ source }) => source === 'import');
            const isUnknown = knownSource.every(({ source }) => source === 'unknown');
            const isComponent = knownSource.every(({ source }) => source === 'components');
            if (isImport) {
                logger.info(`Import      : ${knownSource.map(({ file }) => file).join(', ')}`);
            }
            if (isComponent && userConfig.kafka) {
                logger.info(`Component${pluralArray(knownSource)}  : ${knownSource.map(({ file }) => file).join(', ')}`);
            }
            if (!isImport && !isComponent && (userConfig.kafka || !isUnknown)) {
                logger.info(`Framework${pluralArray(knownSource)}  : ${knownSource.map(({ source, file }) => `${source}` + (file ? ` (${file})` : '')).join(', ')}`);
            }
            if (userConfig.kafka) {
                logger.info(`Is known    : ${knownSource.some(({ known }) => known) ? 'yes' : 'no'}`);
            }
        });
        logger.info('');
    }
    else if (userConfig.outputFormat === 'md') {
        logger.info(`# Result`);
        tags.forEach(({ file, line, tagName, lines, knownSource }) => {
            if (currentFile !== file) {
                logger.info(`File path: ${file}`);
                currentFile = file;
            }
            logger.info('');
            lines.forEach((value, index) => {
                const { text, index: lineIndex } = value;
                const lineNumber = getLineIndexAsString(lineIndex, lines[lines.length - 1].index);
                const endingSlash = index === lines.length - 1 ? '' : '\\';
                const textPart = text
                    ? `\`${text}\` ${endingSlash}`
                    : endingSlash;
                logger.info(`${lineNumber}: ${textPart}`);
            });
            logger.info('');
            logger.info(`Line number: ${line} \\`);
            logger.info(`Tag name: ${tagName} \\`);
            const isImport = knownSource.every(({ source }) => source === 'import');
            const isUnknown = knownSource.every(({ source }) => source === 'unknown');
            const isComponent = knownSource.every(({ source }) => source === 'components');
            if (isImport) {
                logger.info(`Import:`);
                knownSource.forEach(({ file }) => {
                    logger.info(`- ${file}`);
                });
                logger.info('');
            }
            if (isComponent && userConfig.kafka) {
                logger.info(`Component${pluralArray(knownSource)}:`);
                knownSource.forEach(({ file }) => {
                    logger.info(`- ${file}`);
                });
                logger.info('');
            }
            if (!isImport && !isComponent && (userConfig.kafka || !isUnknown)) {
                logger.info(`Framework${pluralArray(knownSource)}:`);
                knownSource.forEach(({ file, source }) => {
                    logger.info(`- ${source}` + (file ? ` (${file})` : ''));
                });
                logger.info('');
            }
            if (userConfig.kafka) {
                logger.info(`Is known: ${knownSource.some(({ known }) => known) ? 'yes' : 'no'} \\`);
                logger.info('');
            }
            logger.info('');
        });
    }
}
