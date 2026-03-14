/**
 * Write the stats to the console.
 *
 * @param stats - scan stats
 * @param filesList - list of files scanned
 * @param tagsList - list of tags found
 * @param uniqueTagsList - list of unique tags found
 * @param showResult - whether to show the result stats
 * @param kafka - whether to show all stats or only unknown stats
 */
export function writeStats({
  stats,
  filesList,
  tagsList,
  uniqueTagsList,
  showResult,
  kafka
}: WriteStatsProps): void {
  const duration: number = stats.endTime - stats.startTime;
  const durationInSeconds: number = duration / 1000;
  const durationAboveSecond: boolean = durationInSeconds >= 1;
  const durationNumber: number = durationAboveSecond ? durationInSeconds : duration;
  const durationUnit: 's' | 'ms' = durationAboveSecond ? 's' : 'ms';

  // Print line between stats & results
  if (showResult) {
    logger.info('');
    logger.info(`>> Result stats                   <<`);
    logger.info('');
    logger.info(`Tag${tagsList.length >= 2 ? 's' : ' '}                      : ${tagsList.length}`);
    logger.info(
      `Unique Tag${uniqueTagsList.length >= 2 ? 's' : ' '}               : ${uniqueTagsList.length}`
    );
    logger.info(
      `File${filesList.length >= 2 ? 's' : ' '}                     : ${filesList.length}`
    );
    logger.info('');
    logger.info('....................................');
    logger.info('');
  }

  logger.info(`>> Scan stats                     <<`);
  logger.info('');
  logger.info(`Directorie${stats.dirCounter >= 2 ? 's' : ' '}               : ${stats.dirCounter}`);
  logger.info(
    `File${stats.fileCounter >= 2 ? 's' : ' '}                     : ${stats.fileCounter}`
  );
  logger.info(
    `Template file${stats.templateFiles >= 2 ? 's' : ' '}            : ${stats.templateFiles}`
  );
  logger.info(`Duration                  : ${durationNumber}${durationUnit}`);

  logger.info('');
  logger.info('....................................');
  logger.info('');

  logger.info(`>> Unique ${kafka ? '' : 'unknown '}tags found${kafka ? '        ' : ''}      <<`);
  logger.info('');
  uniqueTagsList.forEach((tag: string): void => {
    logger.info(` - ${tag}`);
  });

  logger.info('');
  logger.info(`Total                     : ${uniqueTagsList.length}`);

  logger.info('');
  logger.info('....................................');
  logger.info('');
}
