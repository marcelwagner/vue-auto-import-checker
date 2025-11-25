export const writeStats = (
  stats: Stats,
  files: string[],
  unknownTags: UnknownTags[],
  uniqueTags: string[]
) => {
  const duration = stats.endTime - stats.startTime;
  const durationInSeconds = duration / 1000;
  const durationAboveSecond = durationInSeconds >= 1;
  const durationNumber = durationAboveSecond ? durationInSeconds : duration;
  const durationUnit = durationAboveSecond ? 's' : 'ms';

  console.log('');
  console.log(`Found file${files.length >= 2 ? 's' : ' '}         : ${files.length}`);
  console.log(`Found position${unknownTags.length >= 2 ? 's' : ' '}     : ${unknownTags.length}`);
  console.log(`Found unknown tag${uniqueTags.length >= 2 ? 's' : ' '}  : ${uniqueTags.length}`);
  console.log('');

  uniqueTags.map(tag => console.log(`- ${tag}`));

  console.log('');
  console.log(`It took me          : ${durationNumber}${durationUnit}`);
  console.log(`to scan file${stats.fileCounter >= 2 ? 's' : ' '}       : ${stats.fileCounter}`);
  console.log(`in directorie${stats.dirCounter >= 2 ? 's' : ' '}      : ${stats.dirCounter}`);
  console.log(`with template file${stats.templateFiles >= 2 ? 's' : ' '} : ${stats.templateFiles}`);
  console.log('');
};
