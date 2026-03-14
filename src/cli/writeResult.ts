import type { Logger } from 'winston';
import { getLineIndexAsString } from './index.ts';
import { pluralArray } from './plural.ts';

/**
 * Write the result to the console.
 *
 * @param tags - list of tags found
 * @param kafka - whether to show all stats or only unknown stats
 */
export function writeResult(tags: Tag[], kafka: boolean): void {
  let currentFile: string = '';

  logger.info('');
  logger.info(`>> Result                         <<`);

  tags.forEach(({ file, line, tagName, lines, knownSource }: Tag): void => {
    logger.info('');
    if (currentFile !== file) {
      logger.info('----------------------');
      logger.info('');
      logger.info(`File path   : ${file} (${line})`);

      currentFile = file;
    } else {
      logger.info('-----------');
    }

    logger.info('');

    lines.forEach(
      ({ text, index }: UnknownTagLine): Logger =>
        logger.info(`${getLineIndexAsString(index, lines[lines.length - 1].index)}: ${text}`)
    );

    logger.info('');
    logger.info(`Tag name    : ${tagName}`);

    const isImport: boolean = knownSource.every(
      ({ source }: KnownSource): boolean => source === 'import'
    );
    const isUnknown: boolean = knownSource.every(
      ({ source }: KnownSource): boolean => source === 'unknown'
    );
    const isComponent: boolean = knownSource.every(
      ({ source }: KnownSource): boolean => source === 'components'
    );

    if (isImport) {
      logger.info(
        `Import      : ${knownSource.map(({ file }: KnownSource): string => file).join(', ')}`
      );
    }

    if (isComponent && kafka) {
      logger.info(
        `Component${pluralArray(knownSource)}  : ${knownSource.map(({ file }: KnownSource): string => file).join(', ')}`
      );
    }

    if (!isImport && !isComponent && (kafka || !isUnknown)) {
      logger.info(
        `Framework${pluralArray(knownSource)}  : ${knownSource.map(({ source, file }: KnownSource): string => `${source}` + (file ? ` (${file})` : '')).join(', ')}`
      );
    }

    if (kafka) {
      logger.info(
        `Is known    : ${knownSource.some(({ known }: KnownSource): boolean => known) ? 'yes' : 'no'}`
      );
    }
  });

  logger.info('');
}
