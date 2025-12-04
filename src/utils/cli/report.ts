export function getUniqueFromList(list: string[]) {
  return Array.from(new Set(list));
}

export function getLineIndexAsString(index: number, lastIndex: number) {
  const lastDiff10 = Math.floor(lastIndex / 10);
  const lastDiff100 = Math.floor(lastIndex / 100);

  const moreThan10 = lastDiff10 >= 1 && lastDiff10 <= 9;
  const moreThan100 = lastDiff100 >= 1 && lastDiff100 <= 9;

  if ((index <= 9 && moreThan10) || (index >= 10 && index <= 99 && moreThan100)) {
    return ` ${index}`;
  } else {
    return `${index}`;
  }
}
