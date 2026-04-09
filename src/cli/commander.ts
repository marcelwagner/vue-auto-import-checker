import { program } from 'commander';
import { defaultCachePath, packageJson } from '../config/index.ts';

/**
 * Initialize and parse command-line arguments.
 *
 * @returns an object containing parsed CLI options
 **/
export function prepareCommander(): CommanderInit {
  program
    .option(
      '-c, --components-file <file-path>',
      'Path to a file exporting registered components (relative to current working directory)',
      ''
    )
    .option(
      '-p, --project-paths [path...]',
      'List of directory path`s containing Vue project files to scan (relative to current working directory)',
      ''
    )
    .option(
      '-a, --cache-path <cache-path>',
      'Directory for storing and looking up cached/custom known files (relative to current working directory)',
      defaultCachePath
    )
    .option(
      '-t, --tool <tool>',
      'Run a specific helper tool (e.g., Naive UI, Nuxt, PrimeVue, Quasar, Vuetify, VueUse) to generate customized tag lists',
      ''
    )
    .option('-s, --stats', 'Output aggregated scan statistics', false)
    .option('-r, --result', 'Output detailed result entries for each found component', false)
    .option('-q, --quiet', 'Suppress all standard output', false)
    .option('-l, --known-tags [tags...]', 'List of custom component tags to treat as known', [])
    .option(
      '-j, --known-tags-file <file-path>',
      'Path to a JSON file containing a list of component tags to treat as known',
      ''
    )
    .option(
      '-f, --frameworks [frameworks...]',
      'Predefined framework tag sets (e.g., Naive UI, Nuxt, PrimeVue, Quasar, Vuetify, VueUse) as known',
      []
    )
    .option(
      '-n, --negate-known [sets...]',
      'Explicitly treat tag sets as known (e.g., HTML, SVG, Vue, VueRouter)',
      []
    )
    .option(
      '-k, --kafka',
      'Output each found tag with its framework and whether it is recognized',
      false
    )
    .option('-d, --debug', 'Enable detailed debug logging', false)
    .option('-i, --imports-known', 'Treat tags matching imported components as known', false)
    .version(packageJson.version, '-v, --version', 'Output the current version');

  program.parse();

  const options = program.opts();

  // Normalize CLI options into explicit typed variables used by the rest of the program.
  // Use `Boolean(...)` or explicit casts to ensure expected primitive types.
  // commander maps `--known-tags` -> `options.knownTags` and
  // `--known-tags-file` -> `options.knownTagsFile`.
  return {
    knownFrameworks: options.frameworks || [],
    negateKnown: options.negateKnown || [],
    knownTags: options.knownTags || [],
    knownTagsFile: options.knownTagsFile || '',

    showStats: Boolean(options.stats || false),
    showResult: Boolean(options.result || false),
    componentsFile: options.componentsFile || '',
    projectPaths: options.projectPaths || [],

    tool: options.tool || '',
    cachePath: options.cachePath || defaultCachePath,

    kafka: Boolean(options.kafka || false),

    importsKnown: Boolean(options.importsKnown || false),
    quiet: Boolean(options.quiet || false),
    debug: Boolean(options.debug || false)
  };
}
