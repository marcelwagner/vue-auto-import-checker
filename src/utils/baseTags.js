import { baseTags } from "../config/index.js";
import { normalize } from "./normalize.js";
export function getBaseTags(negateKnown) {
    return baseTags.map(base => ({
        tags: base.tags,
        name: base.name,
        known: !negateKnown.includes(base.name),
        file: base.source
    }));
}
export function getBaseTagsList(negateKnown) {
    const baseTags = [];
    negateKnown.forEach(base => {
        const foundBase = findBaseTagsByName(base);
        if (foundBase) {
            baseTags.push(foundBase.name);
        }
        else {
            logger.debug(`Unknown base tags list ${base}`);
        }
    });
    return baseTags;
}
export function findBaseTagsByName(name) {
    return baseTags.find(base => base.name === normalize(name));
}
