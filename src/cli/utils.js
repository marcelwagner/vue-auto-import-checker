import { statistics } from "../utils/index.js";
export function getLineIndexAsString(index, lastIndex) {
    return index.toString().padStart(lastIndex.toString().length, ' ');
}
export function pluralLength(length, singular = ' ', plural = 's') {
    return length >= 2 ? plural : singular;
}
export function pluralArray(iterator, singular = ' ', plural = 's') {
    return pluralLength(iterator.length, singular, plural);
}
export function currentDateTime() {
    return new Date().toLocaleString();
}
export function getDuration() {
    const stats = statistics.getStats();
    const duration = stats.endTime - stats.startTime;
    const durationInSeconds = duration / 1000;
    const durationAboveSecond = durationInSeconds >= 1;
    const durationNumber = durationAboveSecond
        ? durationInSeconds
        : duration;
    const durationUnit = durationAboveSecond ? 's' : 'ms';
    return `${durationNumber}${durationUnit}`;
}
