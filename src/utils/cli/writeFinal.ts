import { program } from 'commander';

export async function writeFinalStats(
  unknownTagsLength: number,
  uniqueTagsLength: number,
  filesLength: number
) {
  const currentDateTime = new Date().toLocaleString();

  if (unknownTagsLength >= 1) {
    const foundText = `Found ${uniqueTagsLength} unique unknown tag${uniqueTagsLength >= 2 ? 's' : ''} in ${unknownTagsLength} line${unknownTagsLength >= 2 ? 's' : ''} in ${filesLength} file${filesLength >= 2 ? 's' : ''}`;

    return program.error(`${currentDateTime}: ${foundText}`, { exitCode: uniqueTagsLength });
  }

  console.log(`${currentDateTime}: No unknown tags found`);
}
