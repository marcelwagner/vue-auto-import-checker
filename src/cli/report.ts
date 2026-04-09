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
