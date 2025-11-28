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

  // Print line between stats & results
  if (showResult) {
    console.log('....................................');
    console.log('');
    console.log(`Files                     : ${files.length}`);
    console.log(
      `Line${unknownTags.length >= 2 ? 's' : ' '}                     : ${unknownTags.length}`
    );
    console.log('');
    console.log('....................................');
    console.log('');
  }

  console.log(`Scan stats`);
  console.log('');
  console.log(`Directorie${stats.dirCounter >= 2 ? 's' : ' '}               : ${stats.dirCounter}`);
  console.log(
    `File${stats.fileCounter >= 2 ? 's' : ' '}                     : ${stats.fileCounter}`
  );
  console.log(
    `Template file${stats.templateFiles >= 2 ? 's' : ' '}            : ${stats.templateFiles}`
  );
  console.log(`Duration                  : ${durationNumber}${durationUnit}`);

  console.log('');
  console.log('....................................');
  console.log('');

  console.log(`Unique unknown tags found`);
  console.log('');
  uniqueTags.map(tag => console.log(` - ${tag}`));

  console.log('');
  console.log(`Total                     : ${uniqueTags.length}`);

  console.log('');
  console.log('....................................');
  console.log('');
}
