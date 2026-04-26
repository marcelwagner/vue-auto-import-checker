import { Option } from 'commander';
import { defaultCachePath } from '../../config.ts';

export const commanderOptionsList: Option[] = [
  new Option(
    '-c, --components-file <file-path>',
    'Path to a file exporting registered components (relative to current working directory)'
  ).default(''),
  new Option(
    '-p, --project-paths [path...]',
    'List of directory path`s containing Vue project files to scan (relative to current working directory)'
  ).default(''),
  new Option(
    '-a, --cache-path <cache-path>',
    'Directory for storing and looking up cached/custom known files (relative to current working directory)'
  ).default(defaultCachePath),
  new Option('-t, --tool <tool>', 'Run a specific helper tool to generate customized tag lists')
    .choices(['naiveui', 'nuxt', 'primevue', 'quasar', 'vuetify', 'vueuse'])
    .implies({ projectPaths: '' })
    .implies({ componentsFile: '' })
    .default(''),
  new Option(
    '-l, --known-tags [tags...]',
    'List of custom component tags to treat as known'
  ).default([]),
  new Option(
    '-j, --known-tags-file <file-path>',
    'Path to a JSON file containing a list of component tags to treat as known'
  ).default(''),
  new Option(
    '-f, --frameworks [frameworks...]',
    'Predefined framework tag sets (e.g., naiveui, nuxt, primevue, quasar, vuetify, vueuse) as known'
  ).default([]),
  new Option(
    '-n, --negate-known [sets...]',
    'Explicitly treat tag sets as known (e.g., html, svg, vue, vuerouter)'
  ).default([]),
  new Option('-i, --imports-known', 'Treat tags matching imported components as known').default(
    false
  ),
  new Option('-s, --stats', 'Output aggregated scan statistics')
    .implies({ quiet: false })
    .default(false),
  new Option('-r, --result', 'Output detailed result entries for each found component')
    .implies({ quiet: false })
    .default(false),
  new Option('-q, --quiet', 'Suppress all standard output')
    .implies({ outputFormat: 'text' })
    .implies({ debug: false })
    .implies({ stats: false })
    .implies({ result: false })
    .default(false),
  new Option('-k, --kafka', 'Output each found tag with its framework and whether it is recognized')
    .conflicts('tool')
    .default(false),
  new Option(
    '-o, --output-format <output-format>',
    'Choose between plain text, md (markdown) or json output'
  )
    .env('OUTPUT_FORMAT')
    .choices(['text', 'md', 'json'])
    .default('text'),
  new Option('-d, --debug', 'Enable detailed debug logging')
    .implies({ outputFormat: 'text' })
    .implies({ quiet: false })
    .default(false),
  new Option('-y, --show-config', 'Show config').default(false)
];
