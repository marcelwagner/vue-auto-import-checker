/**
 * Format the line index for better readability.
 *
 * @param index - line index
 * @param lastIndex - last line index
 */
export function getLineIndexAsString(index: number, lastIndex: number): string {
  const lastDiff10: number = Math.floor(lastIndex / 10);
  const lastDiff100: number = Math.floor(lastIndex / 100);

  const moreThan10: boolean = lastDiff10 >= 1 && lastDiff10 <= 9;
  const moreThan100: boolean = lastDiff100 >= 1 && lastDiff100 <= 9;

  if ((index <= 9 && moreThan10) || (index >= 10 && index <= 99 && moreThan100)) {
    return ` ${index}`;
  } else {
    return `${index}`;
  }
}
