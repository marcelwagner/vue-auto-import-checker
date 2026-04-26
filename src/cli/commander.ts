import { type Option, type OptionValues, program } from 'commander';
import { commanderOptionsList, defaultCachePath, packageJson } from '../config/index.ts';

/**
 * Initialize and parse command-line arguments.
 *
 * @returns an object containing parsed CLI options
 **/
export function prepareCommander(): CommanderInit {
  program.version(packageJson.version, '-v, --version', 'Output the current version');

  commanderOptionsList.forEach((commanderOption: Option): void => {
    program.addOption(commanderOption);
  });

  program.parse();

  const options: OptionValues = program.opts();

  // Normalize CLI options into explicit typed variables used by the rest of the program.
  // Use `Boolean(...)` or explicit casts to ensure expected primitive types.
  // commander maps `--known-tags` -> `options.knownTags` and
  // `--known-tags-file` -> `options.knownTagsFile`.
  return {
    componentsFile: options.componentsFile || '',
    projectPaths: options.projectPaths || [],

    cachePath: options.cachePath || defaultCachePath,
    tool: options.tool || '',

    showStats: Boolean(options.stats || false),
    showResult: Boolean(options.result || false),
    quiet: Boolean(options.quiet || false),

    knownTags: options.knownTags || [],
    knownTagsFile: options.knownTagsFile || '',
    knownFrameworks: options.frameworks || [],
    negateKnown: options.negateKnown || [],

    kafka: Boolean(options.kafka || false),

    outputFormat: options.outputFormat || 'text',

    importsKnown: Boolean(options.importsKnown || false),
    debug: Boolean(options.debug || false),
    showConfig: Boolean(options.showConfig || false)
  };
}
