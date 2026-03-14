/**
 * Returns the singular or plural form of a word based on the length of the provided iterator.
 *
 * @param length - a number whose length determines whether to return the singular or plural form
 * @param singular - the singular form of the word
 * @param plural - the plural form of the word
 * @returns string - the singular or plural form of the word based on the length of the provided iterator
 */
export function pluralLength(length: number, singular = ' ', plural = 's'): string {
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
export function pluralArray(iterator: unknown[], singular = ' ', plural = 's'): string {
  return pluralLength(iterator.length, singular, plural);
}
