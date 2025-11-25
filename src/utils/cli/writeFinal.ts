import { program } from 'commander';

export const writeFinal = async (
  unknownTagsLength: number,
  uniqueTagsLength: number,
  filesLength: number
) => {
  const currentDateTime = new Date().toLocaleString();

  if (unknownTagsLength >= 1) {
    const foundText = `Found ${uniqueTagsLength} unknown tag${uniqueTagsLength >= 2 ? 's' : ''} on ${unknownTagsLength} position${unknownTagsLength >= 2 ? 's' : ''} in ${filesLength} file${filesLength >= 2 ? 's' : ''}`;

    return program.error(`${currentDateTime}: ${foundText}`, { exitCode: -1 });
  }

  console.log(`${currentDateTime}: No unknown tags found`);
};
