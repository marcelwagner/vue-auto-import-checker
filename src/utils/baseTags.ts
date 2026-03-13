import { baseTags } from '../config/index.ts';

/**
 * Get the list of base tags to search for.
 * @param negateKnown
 */
export function getBaseTags(negateKnown: Known[]): KnownList[] {
  return baseTags.map(base => ({
    tags: base.tags,
    name: base.name as Source,
    known: !negateKnown.includes(base.name as Known),
    file: base.source
  }));
}

/**
 * Get the list of base names to search for.
 * @param negateKnown
 */
export function getBaseTagsList(negateKnown: string[]) {
  const baseTags: Known[] = [];

  negateKnown.forEach(base => {
    const foundBase = findBaseTagsByName(base);
    if (foundBase) {
      baseTags.push(foundBase.name as Known);
    } else {
      logger.debug(`Unknown base tags list ${base}`);
    }
  });

  return baseTags;
}

/**
 * Find a base tag by name.
 * @param name
 */
export function findBaseTagsByName(name: string) {
  return baseTags.find(base => base.name === name.replace(/_-/, '').toLowerCase());
}
