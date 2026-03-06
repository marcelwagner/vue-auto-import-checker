export function writeStats({
  stats,
  filesList,
  tagsList,
  uniqueTagsList,
  showResult
}: WriteStatsProps) {
  const duration = stats.endTime - stats.startTime;
  const durationInSeconds = duration / 1000;
  const durationAboveSecond = durationInSeconds >= 1;
  const durationNumber = durationAboveSecond ? durationInSeconds : duration;
  const durationUnit = durationAboveSecond ? 's' : 'ms';

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

  logger.info(`>> Unique unknown tags found      <<`);
  logger.info('');
  uniqueTagsList.forEach(tag => logger.info(` - ${tag}`));

  logger.info('');
  logger.info(`Total                     : ${uniqueTagsList.length}`);

  logger.info('');
  logger.info('....................................');
  logger.info('');
}
