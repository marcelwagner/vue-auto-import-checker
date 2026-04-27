import { getUniqueFromList, statistics } from '../utils/index.ts';
import { getDuration } from './index.ts';
import { userConfig } from '../config/index.ts';

export function getJsonResultFromTags(tagsList: Tag[]) {
  const stats: Stats = statistics.getStats();

  const uniqueTagsList: string[] = getUniqueFromList(
    tagsList.map((tag: Tag): string => tag.tagName)
  );
  const filesList: string[] = getUniqueFromList(
    tagsList.map((tag: Tag): string => tag.file)
  );

  const result = `${userConfig.kafka ? 't' : 'unknownT'}ags`;

  return {
    [result]: tagsList,
    uniqueTags: uniqueTagsList,
    filesContainingTags: filesList,
    summary: {
      lines: tagsList.length,
      uniqueTags: uniqueTagsList.length,
      filesContainingTags: filesList.length
    },
    stats: {
      directories: stats.dirCounter,
      files: stats.fileCounter,
      templateFiles: stats.templateFiles,
      duration: getDuration()
    },
    total: uniqueTagsList.length,
    success:
      (!userConfig.kafka && tagsList.length === 0) ||
      (userConfig.kafka && tagsList.length >= 1)
  };
}

export function getJsonResultFromComponents(componentsList: string[]) {
  return {
    components: componentsList,
    stats: {
      duration: getDuration()
    },
    total: componentsList.length,
    success: componentsList.length >= 1
  };
}

export function getJsonResultFromToolTags(tagsList: string[]) {
  return {
    components: tagsList,
    stats: {
      duration: getDuration()
    },
    total: tagsList.length,
    success: tagsList.length >= 1
  };
}
