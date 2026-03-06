import { program } from 'commander';
import { defaultCachePath, packageJson } from "../../config.js";
export function prepareCommander() {
    program
        .option('-c, --components-file <file>', 'path to a file exporting registered components (relative to current working directory)', '')
        .option('-p, --project-path <path>', 'directory path containing Vue project files to scan (relative to current working directory)', '')
        .option('-a, --cache-path <path>', 'directory for storing and looking up cached/custom known files (relative to current working directory)', defaultCachePath)
        .option('-t, --tool <tool>', 'run a specific helper tool (e.g., nuxt, primevue, quasar, vueuse, vuetify) to generate customized tag lists', '')
        .option('-s, --stats', 'output aggregated scan statistics', false)
        .option('-r, --result', 'output detailed result entries for each found component', false)
        .option('-q, --quiet', 'suppress all standard output', false)
        .option('-l, --known-tags [tags...]', 'list of custom component tags to treat as known', [])
        .option('-j, --known-tags-file <file>', 'path to a JSON file containing a list of component tags to treat as known', '')
        .option('-f, --frameworks [frameworks...]', 'predefined framework tag sets (e.g., vuetify, vueuse, quasar, nuxt, naiveui, primevue) as known', [])
        .option('-n, --negate-known [sets...]', 'explicitly treat tag-sets as known (e.g., html, svg, vue, vue-router)', [])
        .option('-k, --kafka', 'output each found tag with its framework and whether it is recognized', false)
        .option('-d, --debug', 'enable detailed debug logging', false)
        .option('-i, --imports-known', 'treat tags matching imported components as known', false)
        .version(packageJson.version, '-v, --version', 'output the current version');
    program.parse();
    const options = program.opts();
    return {
        knownFrameworks: options.frameworks || [],
        negateKnown: options.negateKnown || [],
        knownTags: options.knownTags || [],
        knownTagsFile: options.knownTagsFile || '',
        showStats: Boolean(options.stats || false),
        showResult: Boolean(options.result || false),
        componentsFile: options.componentsFile || '',
        projectPath: options.projectPath || '',
        tool: options.tool || '',
        cachePath: options.cachePath || defaultCachePath,
        kafka: Boolean(options.kafka || false),
        importsKnown: Boolean(options.importsKnown || false),
        quiet: Boolean(options.quiet || false),
        debug: Boolean(options.debug || false)
    };
}
