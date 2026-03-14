import { baseTags } from '../config/index.ts';
import { normalize } from './normalize.ts';

/**
 * Get the list of base tags to search for.
 *
 * @param negateKnown - list of known base tags
 * @returns KnownList[] - list of base tags
 */
export function getBaseTags(negateKnown: Known[]): KnownList[] {
  return baseTags.map(
    (base: BaseTags): KnownList => ({
      tags: base.tags,
      name: base.name as Source,
      known: !negateKnown.includes(base.name as Known),
      file: base.source
    })
  );
}

/**
 * Get the list of base names to search for.
 *
 * @param negateKnown - list of known base tags
 * @returns Known[] - list of base names
 */
export function getBaseTagsList(negateKnown: string[]): Known[] {
  const baseTags: Known[] = [];

  negateKnown.forEach((base: string): void => {
    const foundBase: BaseTags | undefined = findBaseTagsByName(base);
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
 *
 * @param name - name of the base tag
 * @returns BaseTags | undefined
 */
export function findBaseTagsByName(name: string): BaseTags | undefined {
  return baseTags.find((base: BaseTags): boolean => base.name === normalize(name));
}
