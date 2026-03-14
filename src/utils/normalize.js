export function normalize(text) {
    return text.replace(/_|-| /g, '').toLowerCase();
}
