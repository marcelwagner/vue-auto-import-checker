import { userConfig } from '../config/index.ts';
import {
  currentDateTime,
  writeFinalState,
  writeToolsResult,
  getJsonResultFromToolTags,
  writeResult,
  writeConfig,
  writeStats,
  getJsonResultFromTags,
  writeComponents,
  getJsonResultFromComponents
} from './index.ts';
import { getUniqueFromList } from '../utils/index.ts';

export function writeToolOutput(toolTags: string[], toolName: string): void {
  if (userConfig.outputFormat !== 'json') {
    // Present tool output in human-friendly format.
    writeToolsResult(toolName, toolTags);
  }

  const foundText: string =
    toolTags.length >= 1
      ? `Found ${toolTags.length} ${toolName} tag${toolTags.length >= 2 ? 's' : ''}`
      : `No ${toolName} tags found`;

  const json =
    userConfig.outputFormat === 'json'
      ? getJsonResultFromToolTags(toolTags)
      : {};

  // Finalize with exit code 0 (success).
  writeFinalState(false, `${currentDateTime()}: ${foundText}`, 0, json);
}

export function writeTagsOutput(tagsList: Tag[]): void {
  // Compute unique tag names and unique files for summary/stats.
  const uniqueTagsList: string[] = getUniqueFromList(
    tagsList.map((tag: Tag): string => tag.tagName)
  );
  const filesList: string[] = getUniqueFromList(
    tagsList.map((tag: Tag): string => tag.file)
  );

  if (userConfig.outputFormat !== 'json') {
    if (userConfig.showResult) {
      writeResult(tagsList);
    }

    if (userConfig.debug) {
      writeConfig();
    }

    if (userConfig.showStats) {
      writeStats(tagsList);
    }
  }

  const foundText: string =
    tagsList.length >= 1
      ? `Found ${uniqueTagsList.length} unique ${userConfig.kafka ? '' : 'unknown '}tag${uniqueTagsList.length >= 2 ? 's' : ''} in ${tagsList.length} line${tagsList.length >= 2 ? 's' : ''} in ${filesList.length} file${filesList.length >= 2 ? 's' : ''}`
      : `No unknown tags found`;

  const json =
    userConfig.outputFormat === 'json' ? getJsonResultFromTags(tagsList) : {};

  writeFinalState(
    userConfig.kafka ? false : tagsList.length >= 1,
    `${currentDateTime()}: ${foundText}`,
    userConfig.kafka ? 0 : tagsList.length,
    json
  );
}

export function writeComponentsOutput(componentsList: string[]): void {
  if (userConfig.outputFormat !== 'json') {
    // Display discovered components.
    writeComponents(componentsList);
  }

  const foundText: string =
    componentsList.length >= 1
      ? `Found ${componentsList.length} component${componentsList.length >= 2 ? 's' : ''}`
      : `No components found`;

  const json =
    userConfig.outputFormat === 'json'
      ? getJsonResultFromComponents(componentsList)
      : {};

  // Exit with success.
  writeFinalState(false, `${currentDateTime()}: ${foundText}`, 0, json);
}
