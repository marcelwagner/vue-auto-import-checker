export function writeStats(
  stats: Stats,
  files: string[],
  unknownTags: UnknownTags[],
  uniqueTags: string[],
  showResult: boolean
) {
  const duration = stats.endTime - stats.startTime;
  const durationInSeconds = duration / 1000;
  const durationAboveSecond = durationInSeconds >= 1;
  const durationNumber = durationAboveSecond ? durationInSeconds : duration;
  const durationUnit = durationAboveSecond ? 's' : 'ms';

  logger.debug('');
  logger.debug('-----------------------------------');
  logger.debug('Show Stats:');
  logger.debug('');

  // Print line between stats & results
  if (showResult) {
    logger.info('....................................');
    logger.info('');
    logger.info(`Files                     : ${files.length}`);
    logger.info(
      `Line${unknownTags.length >= 2 ? 's' : ' '}                     : ${unknownTags.length}`
    );
    logger.info('');
    logger.info('....................................');
    logger.info('');
  }

  logger.info(`Scan stats`);
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

  logger.info(`Unique unknown tags found`);
  logger.info('');
  uniqueTags.map(tag => logger.info(` - ${tag}`));

  logger.info('');
  logger.info(`Total                     : ${uniqueTags.length}`);

  logger.info('');
  logger.info('....................................');
  logger.info('');
}
