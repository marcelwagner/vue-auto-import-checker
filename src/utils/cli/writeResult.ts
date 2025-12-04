import { getLineIndexAsString } from './report';

export function writeResult(unknownTags: UnknownTags[]) {
  let currentFile = '';
  logger.debug('');
  logger.debug('-----------------------------------');
  logger.debug('Show Result:');
  logger.debug('');

  unknownTags.forEach(({ file, line, tagName, lines }) => {
    if (currentFile !== file) {
      logger.info('');
      logger.info(`File: ${file}`);

      currentFile = file;
    }

    logger.info('');

    lines.forEach(({ text, index }) =>
      logger.info(`${getLineIndexAsString(index, lines[lines.length - 1].index)}: ${text}`)
    );

    logger.info('');
    logger.info(`Line: ${line}, Tag: ${tagName}`);
  });

  logger.info('');
}
