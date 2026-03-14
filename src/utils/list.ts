/**
 * Get unique values from a list.
 *
 * @param list - list of values
 * @returns string[] - unique values
 */
export function getUniqueFromList(list: string[]): string[] {
  return Array.from(new Set(list));
}
