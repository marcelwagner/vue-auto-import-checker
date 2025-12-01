#!/usr/bin/env -S npx tsx

import { program } from 'commander';
import path from 'node:path';
import url from 'node:url';
import checkForUnknownTags, {
  getComponentList,
  getToolName,
  getUniqueFromList,
  isPossibleTool,
  tools,
  writeComponents,
  writeFinalState,
  writeResult,
  writeStats,
  writeToolsResult
} from './index.ts';
import packageJson from './package.json';

const __filename = url.fileURLToPath(import.meta.url);
const basePath = path.dirname(__filename);

// Configure CLI options with commander. Each option is documented in English
// so users and maintainers can quickly understand expected inputs.
program
  .option(
    '-c --components-file <file>',
    'write the file name or path to the file (relative to the current working directory)',
    './components.d.ts'
  )
  .option(
    '-p --project-path <path>',
    'path to the vue project files to look for vue components (relative to the current working directory)',
    ''
  )
  .option('-t --tool <tool>', 'use a tool to customize your checker', '')
  .option('-s --stats', 'print stats after check', false)
  .option('-r --result', 'print result after check', false)
  .option('-q --quiet', 'suppress output', false)
  .option('--customtags [customtags...]', 'ignore these tags', [])
  .option('--customtagsfile <customtagsfile>', 'Ignore tags listed in this json file', '')
  .option('--vuetify', 'ignore vuetify tags', false)
  .option('--vueuse', 'ignore vueUse tags', false)
  .option('--quasar', 'ignore quasar tags', false)
  .option('--nohtml', "don't ignore html tags", false)
  .option('--nosvg', "don't ignore svg tags", false)
  .option('--novue', "don't ignore vue tags", false)
  .option('--novuerouter', "don't ignore vueRouter tags", false)
  .version(packageJson.version, '-v, --version', 'output the current version');

program.parse();

const options = program.opts();
// Normalize CLI options into explicit types used by the program.
// These booleans and strings are passed to the main processing functions.
const quiet = Boolean(options.quiet);
const vuetify = Boolean(options.vuetify);
const vueUse = Boolean(options.vueuse);
const quasar = Boolean(options.quasar);
const noHtml = Boolean(options.nohtml);
const noSvg = Boolean(options.nosvg);
const noVue = Boolean(options.novue);
const noVueRouter = Boolean(options.novuerouter);
const customTags: string[] = options.customtags;
const customTagsFile: string = options.customtagsfile;
const showStats = Boolean(options.stats);
const showResult = Boolean(options.result);
const componentsFile = String(options.componentsFile);
const projectPath = String(options.projectPath);
const tool: string = options.tool;

// Main async entry: decide between running a tool, listing components or scanning a project.
(async () => {
  // If a tool was requested, run the tool flow.
  // Tools are user-facing helpers that return tag lists (e.g. for frameworks/libraries).
  if (tool.length >= 1) {
    try {
      if (!isPossibleTool(tool)) {
        // commander will print a helpful error and exit
        return program.error(`No tool found with the name ${tool} found.`, { exitCode: -1 });
      }

      const toolName = getToolName(tool);
      const toolFunction = tools[toolName as keyof typeof tools];

      // Execute the tool, passing current working directory as context.
      const toolTags = await toolFunction(process.env?.PWD || '');

      if (!quiet) {
        // Print tool results unless quiet mode is enabled.
        writeToolsResult(toolName, toolTags);
      }

      const currentDateTime = new Date().toLocaleString();

      const foundText =
        toolTags.length >= 1
          ? `${currentDateTime}: Found ${toolTags.length} ${toolName} tag${toolTags.length >= 2 ? 's' : ''}`
          : `${currentDateTime}: No ${toolName} tags found`;

      // Finalize and exit with success (no tags found).
      return writeFinalState(false, foundText, 0);
    } catch (error: any) {
      // Propagate tool-specific errors via commander for consistent CLI behavior.
      return program.error(`Tool error ${error?.errorText ? error?.errorText : error}`, {
        exitCode: -1
      });
    }
  }

  // If only a components file path was provided, list components and exit.
  // This mode is useful to inspect which components the checker will consider registered.
  if (componentsFile && !projectPath) {
    try {
      // Get the component list, passing current working directory & componentFile.
      const componentsList = await getComponentList(
        path.join(process.env?.PWD || '', componentsFile)
      );

      if (!quiet) {
        // Print components results unless quiet mode is enabled.
        writeComponents(componentsList);
      }

      const currentDateTime = new Date().toLocaleString();

      const foundText =
        componentsList.length >= 1
          ? `${currentDateTime}: Found ${componentsList.length} component${componentsList.length >= 2 ? 's' : ''}`
          : `${currentDateTime}: No components found`;

      // Finalize and exit with success (no components found).
      return writeFinalState(false, foundText, 0);
    } catch (error: any) {
      // Surface parsing/IO errors when reading the components file.
      return program.error(`Component list error ${error?.errorText ? error?.errorText : error}`, {
        exitCode: -1
      });
    }
  }

  // Otherwise run the full unknown-tag scan using provided project path and options.
  try {
    const { unknownTags, stats } = await checkForUnknownTags({
      componentsFile: path.join(process.env?.PWD || '', componentsFile),
      projectPath: path.join(process.env?.PWD || '', projectPath),
      userGeneratedPath: path.join(process.env?.PWD || '', 'node_modules/.cache'),
      noHtml,
      noSvg,
      noVue,
      noVueRouter,
      vuetify,
      vueUse,
      quasar,
      customTags,
      customTagsFile: customTagsFile ? path.join(process.env?.PWD || '', customTagsFile) : '',
      basePath
    });

    // Aggregate unique tags and files for summary and optional reporting.
    const uniqueTags = getUniqueFromList(unknownTags.map(tag => tag.tagName));
    const files = getUniqueFromList(unknownTags.map(tag => tag.file));

    // Respect quiet mode: optionally print detailed result and/or stats.
    if (!quiet) {
      if (showResult) {
        writeResult(unknownTags);
      }

      if (showStats) {
        writeStats(stats, files, unknownTags, uniqueTags, showResult);
      }
    }

    const currentDateTime = new Date().toLocaleString();

    const foundText =
      unknownTags.length >= 1
        ? `${currentDateTime}: Found ${uniqueTags.length} unique unknown tag${uniqueTags.length >= 2 ? 's' : ''} in ${unknownTags.length} line${unknownTags.length >= 2 ? 's' : ''} in ${files.length} file${files.length >= 2 ? 's' : ''}`
        : `${currentDateTime}: No unknown tags found`;

    // Final state: exit code reflects whether unknown tags were found.
    return writeFinalState(unknownTags.length >= 1, foundText, unknownTags.length);
  } catch (error: any) {
    // Surface scanning or IO errors via commander for consistent CLI UX.
    return program.error(`Program error: ${error?.errorText ? error?.errorText : error}`, {
      exitCode: -1
    });
  }
})();
