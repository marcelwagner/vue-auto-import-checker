/**
 * Normalize a text by removing hyphens, space, minus, underscore and converting to lowercase.
 *
 * @param text - the text to normalize
 * @returns string - normalized text
 *
 * @example normalizeTag('my-button') // 'mybutton'
 * @example normalizeTag('my_button') // 'mybutton'
 * @example normalizeTag('MyButton') // 'mybutton'
 */
export function normalize(text: string): string {
  return text.replace(/_|-| /g, '').toLowerCase();
}
