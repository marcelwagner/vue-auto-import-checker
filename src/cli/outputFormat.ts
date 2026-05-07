import { outputFormatDefault, outputFormatList } from '../config/index.ts';

/**
 * Resolve the output format from the provided format string.
 *
 * @param format - requested output format
 * @returns valid output format or the default output format
 */
export function getOutputFormat(format: string): OutputFormat {
  const foundFormat: string | undefined = outputFormatList.find(
    outputFormat => outputFormat === format
  );

  return foundFormat ? (foundFormat as OutputFormat) : outputFormatDefault;
}
