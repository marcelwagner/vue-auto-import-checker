import { getLineIndexAsString } from "./index.js";
export function writeResult(tags, kafka) {
    let currentFile = '';
    logger.info('');
    logger.info(`>> Result                         <<`);
    tags.forEach(({ file, line, tagName, lines, knownSource }) => {
        logger.info('');
        if (currentFile !== file) {
            logger.info('----------------------');
            logger.info('');
            logger.info(`File path   : ${file} (${line})`);
            currentFile = file;
        }
        else {
            logger.info('-----------');
        }
        logger.info('');
        lines.forEach(({ text, index }) => logger.info(`${getLineIndexAsString(index, lines[lines.length - 1].index)}: ${text}`));
        logger.info('');
        logger.info(`Tag name    : ${tagName}`);
        const isImport = knownSource.every(({ source }) => source === 'import');
        const isUnknown = knownSource.every(({ source }) => source === 'unknown');
        const isComponent = knownSource.every(({ source }) => source === 'components');
        if (isImport) {
            logger.info(`Import      : ${knownSource.map(({ file }) => file).join(', ')}`);
        }
        if (isComponent && kafka) {
            logger.info(`Components  : ${knownSource.map(({ file }) => file).join(', ')}`);
        }
        if (!isImport && !isComponent && (kafka || !isUnknown)) {
            logger.info(`Framework${knownSource.length >= 2 ? 's' : ' '}  : ${knownSource.map(({ source, file }) => `${source}` + (file ? ` (${file})` : '')).join(', ')}`);
        }
        if (kafka) {
            logger.info(`Is known    : ${knownSource.some(({ known }) => known) ? 'yes' : 'no'}`);
        }
    });
    logger.info('');
}
