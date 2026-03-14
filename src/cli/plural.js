export function pluralLength(length, singular = ' ', plural = 's') {
    return length >= 2 ? plural : singular;
}
export function pluralArray(iterator, singular = ' ', plural = 's') {
    return pluralLength(iterator.length, singular, plural);
}
