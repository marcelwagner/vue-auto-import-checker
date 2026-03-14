export function getLineIndexAsString(index, lastIndex) {
    return index.toString().padStart(lastIndex.toString().length, ' ');
}
