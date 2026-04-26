import { statistics } from '../utils/index.ts';

/**
 * Format the line index for better readability.
 *
 * @param index - line index
 * @param lastIndex - last line index
 * @returns string - formatted line index
 */
export function getLineIndexAsString(index: number, lastIndex: number): string {
  return index.toString().padStart(lastIndex.toString().length, ' ');
}

/**
 * Returns the singular or plural form of a word based on the length of the provided iterator.
 *
 * @param length - a number whose length determines whether to return the singular or plural form
 * @param singular - the singular form of the word
 * @param plural - the plural form of the word
 * @returns string - the singular or plural form of the word based on the length of the provided iterator
 */
export function pluralLength(
  length: number,
  singular = ' ',
  plural = 's'
): string {
  return length >= 2 ? plural : singular;
}

/**
 * Returns the singular or plural form of a word based on the length of the provided iterator.
 *
 * @param iterator - an array whose length determines whether to return the singular or plural form
 * @param singular - the singular form of the word
 * @param plural - the plural form of the word
 * @returns string - the singular or plural form of the word based on the length of the provided iterator
 */
export function pluralArray(
  iterator: unknown[],
  singular = ' ',
  plural = 's'
): string {
  return pluralLength(iterator.length, singular, plural);
}

/**
 * Get the current date and time as a string.
 *
 * @returns string - current date and time
 */
export function currentDateTime(): string {
  return new Date().toLocaleString();
}

export function getDuration() {
  const stats: Stats = statistics.getStats();

  const duration: number = stats.endTime - stats.startTime;
  const durationInSeconds: number = duration / 1000;
  const durationAboveSecond: boolean = durationInSeconds >= 1;
  const durationNumber: number = durationAboveSecond
    ? durationInSeconds
    : duration;
  const durationUnit: 's' | 'ms' = durationAboveSecond ? 's' : 'ms';

  return `${durationNumber}${durationUnit}`;
}
