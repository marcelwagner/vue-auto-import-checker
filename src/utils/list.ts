/**
 * Get unique values from a list.
 * @param list
 */
export function getUniqueFromList(list: string[]) {
  return Array.from(new Set(list));
}
