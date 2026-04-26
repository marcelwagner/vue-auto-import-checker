import { userConfig } from '../config/index.ts';
import { logger } from '../utils/index.ts';
import { getLineIndexAsString, pluralArray } from './index.ts';

/**
 * Write the result to the console.
 *
 * @param tags - list of tags found
 */
export function writeResult(tags: Tag[]): void {
  let currentFile: string = '';

  if (userConfig.outputFormat === 'text') {
    logger.info('');
    logger.info(`>> Result                         <<`);

    tags.forEach(({ file, line, tagName, lines, knownSource }: Tag): void => {
      logger.info('');
      if (currentFile !== file) {
        logger.info('----------------------');
        logger.info('');
        logger.info(`File path   : ${file}`);

        currentFile = file;
      } else {
        logger.info('-----------');
      }

      logger.info('');

      lines.forEach(({ text, index }: UnknownTagLine): void =>
        logger.info(
          `${getLineIndexAsString(index, lines[lines.length - 1].index)}: ${text}`
        )
      );

      logger.info('');
      logger.info(`Line number: ${line}`);
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

      if (isComponent && userConfig.kafka) {
        logger.info(
          `Component${pluralArray(knownSource)}  : ${knownSource.map(({ file }: KnownSource): string => file).join(', ')}`
        );
      }

      if (!isImport && !isComponent && (userConfig.kafka || !isUnknown)) {
        logger.info(
          `Framework${pluralArray(knownSource)}  : ${knownSource.map(({ source, file }: KnownSource): string => `${source}` + (file ? ` (${file})` : '')).join(', ')}`
        );
      }

      if (userConfig.kafka) {
        logger.info(
          `Is known    : ${knownSource.some(({ known }: KnownSource): boolean => known) ? 'yes' : 'no'}`
        );
      }
    });

    logger.info('');
  } else if (userConfig.outputFormat === 'md') {
    logger.info(`# Result`);

    tags.forEach(({ file, line, tagName, lines, knownSource }: Tag): void => {
      if (currentFile !== file) {
        logger.info(`File path: ${file}`);

        currentFile = file;
      }

      logger.info('');
      lines.forEach((value: UnknownTagLine, index: number): void => {
        const { text, index: lineIndex } = value;

        const lineNumber: string = getLineIndexAsString(
          lineIndex,
          lines[lines.length - 1].index
        );
        const endingSlash: string = index === lines.length - 1 ? '' : '\\';
        const textPart: string = text
          ? `\`${text}\` ${endingSlash}`
          : endingSlash;

        logger.info(`${lineNumber}: ${textPart}`);
      });
      logger.info('');

      logger.info(`Line number: ${line} \\`);
      logger.info(`Tag name: ${tagName} \\`);

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
        logger.info(`Import:`);
        knownSource.forEach(({ file }: KnownSource): void => {
          logger.info(`- ${file}`);
        });
        logger.info('');
      }

      if (isComponent && userConfig.kafka) {
        logger.info(`Component${pluralArray(knownSource)}:`);
        knownSource.forEach(({ file }: KnownSource): void => {
          logger.info(`- ${file}`);
        });
        logger.info('');
      }

      if (!isImport && !isComponent && (userConfig.kafka || !isUnknown)) {
        logger.info(`Framework${pluralArray(knownSource)}:`);
        knownSource.forEach(({ file, source }: KnownSource): void => {
          logger.info(`- ${source}` + (file ? ` (${file})` : ''));
        });
        logger.info('');
      }

      if (userConfig.kafka) {
        logger.info(
          `Is known: ${knownSource.some(({ known }: KnownSource): boolean => known) ? 'yes' : 'no'} \\`
        );
        logger.info('');
      }

      logger.info('');
    });
  }
}
