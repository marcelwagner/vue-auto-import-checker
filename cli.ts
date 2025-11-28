#!/usr/bin/env -S npx tsx

import { program } from 'commander';
import path from 'node:path';
import url from 'node:url';
import checkForUnknownTags, {
  getComponentList,
  getToolName,
  isPossibleTool,
  tools,
  writeComponents,
  writeFinalStats,
  writeResult,
  writeStats,
  writeToolsResult
} from './index.ts';
import packageJson from './package.json';
import { getUniqueFromList } from './src/utils/reportUtils.ts';

const __filename = url.fileURLToPath(import.meta.url);
const basePath = path.dirname(__filename);

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
  .option('--vuetify', 'ignore vuetify tags', false)
  .option('--vueuse', 'ignore vueUse tags', false)
  .option('--nohtml', 'ignore html tags', false)
  .option('--nosvg', 'ignore svg tags', false)
  .option('--novue', 'ignore vue tags', false)
  .option('--novuerouter', 'ignore vueRouter tags', true)
  .version(packageJson.version, '-v, --version', 'output the current version');

program.parse();

const options = program.opts();
// Quiet mode
const quiet = Boolean(options.quiet);
// Ignore tags
const vuetify = Boolean(options.vuetify);
const vueUse = Boolean(options.vueuse);
const noHtml = Boolean(options.nohtml);
const noSvg = Boolean(options.nosvg);
const noVue = Boolean(options.novue);
const noVueRouter = Boolean(options.novuerouter);
const customTags: string[] = options.customtags;
// Stats and result
const showStats = Boolean(options.stats);
const showResult = Boolean(options.result);
// Paths
const componentsFile = String(options.componentsFile);
const projectPath = String(options.projectPath);
// Tools
const tool: string = options.tool;

(async () => {
  if (tool.length >= 1) {
    try {
      if (!isPossibleTool(tool)) {
        return program.error(`No tool found with the name ${tool} found.`, { exitCode: -1 });
      }

      const toolName = getToolName(tool);
      const toolFunction = tools[toolName as keyof typeof tools];

      const toolTags = await toolFunction(process.env?.PWD || '');

      return writeToolsResult(toolName, toolTags);
    } catch (error: any) {
      return program.error(`Tool error ${error?.errorText ? error?.errorText : error}`, {
        exitCode: -1
      });
    }
  }

  // If only components file is provided, list components and exit
  if (componentsFile && !projectPath) {
    try {
      const componentsList = await getComponentList(
        path.join(process.env?.PWD || '', componentsFile)
      );

      return writeComponents(componentsList);
    } catch (error: any) {
      return program.error(`Component list error ${error?.errorText ? error?.errorText : error}`, {
        exitCode: -1
      });
    }
  }

  // If project path and components file are provided, check for unknown tags
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
      customTags,
      basePath
    });

    const uniqueTags = getUniqueFromList(unknownTags.map(tag => tag.tagName));
    const files = getUniqueFromList(unknownTags.map(tag => tag.file));

    // Handle quiet mode
    if (!quiet) {
      // Print result
      if (showResult) {
        writeResult(unknownTags);
      }

      // Print stats
      if (showStats) {
        writeStats(stats, files, unknownTags, uniqueTags, showResult);
      }
    }

    return writeFinalStats(unknownTags.length, uniqueTags.length, files.length);
  } catch (error: any) {
    return program.error(`Program error: ${error?.errorText ? error?.errorText : error}`, {
      exitCode: -1
    });
  }
})();
