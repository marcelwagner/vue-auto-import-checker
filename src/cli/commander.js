import { program } from 'commander';
import { commanderOptionsList, defaultCachePath, packageJson } from "../config/index.js";
export function prepareCommander() {
    program.version(packageJson.version, '-v, --version', 'Output the current version');
    commanderOptionsList.forEach((commanderOption) => {
        program.addOption(commanderOption);
    });
    program.parse();
    const options = program.opts();
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
