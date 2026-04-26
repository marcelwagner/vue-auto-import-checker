import { baseTags } from "../config/index.js";
import { logger } from "./logger.js";
import { normalize } from "./normalize.js";
export function getKnownBaseTags(negateKnown) {
    return baseTags.map((base) => ({
        tags: base.tags,
        name: base.name,
        known: !negateKnown.includes(base.name),
        file: base.source
    }));
}
export function getKnownBaseTagsList(negateKnown) {
    const baseTags = [];
    negateKnown.forEach((base) => {
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
    return baseTags.find((base) => base.name === normalize(name));
}
