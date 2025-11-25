#!/usr/bin/env -S npx tsx

import { program } from 'commander';
import path from 'node:path';
import url from 'node:url';
import checkForUnknownTags, {
  componentList,
  vuetifyComponentsImporter,
  vueUseComponentsImporter,
  writeComponents,
  writeFinal,
  writeResult,
  writeStats,
  writeToolsResult
} from './index.ts';
import packageJson from './package.json';

const __filename = url.fileURLToPath(import.meta.url);
const basePath = path.dirname(__filename);

(async () => {
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
    .option('-t --tools [tools...]', 'use tools to customize your checker', [])
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
  const tools: string[] = options.tools;

  if (tools.length >= 1) {
    try {
      if (!['vuetify-importer', 'vueuse-importer'].some(tool => !tools.includes(tool))) {
        program.error(`No tool found with the name ${tools} found.`, { exitCode: -1 });
      }

      const vuetify = tools.includes('vuetify-importer');

      const toolTags = vuetify
        ? await vuetifyComponentsImporter(basePath)
        : await vueUseComponentsImporter(basePath);

      if (toolTags.length >= 1) {
        writeToolsResult(tools, toolTags);
        return;
      }

      console.log(`No tags found`);
    } catch (error: any) {
      program.error(`Tool error ${error?.errorText}`, { exitCode: -1 });
    }
    return;
  }

  // If only components file is provided, list components and exit
  if (componentsFile && !projectPath) {
    try {
      const componentsList = await componentList(path.join(basePath, componentsFile));

      if (componentsList.length >= 1) {
        writeComponents(componentsList);
        return;
      }

      console.log(`No components found`);
    } catch (error: any) {
      program.error(`Component list error ${error?.errorText}`, { exitCode: -1 });
    }
    return;
  }

  // If project path and components file are provided, check for unknown tags
  try {
    const { unknownTags, stats } = await checkForUnknownTags({
      componentsFile,
      projectPath,
      noHtml,
      noSvg,
      noVue,
      noVueRouter,
      vuetify,
      vueUse,
      customTags,
      basePath
    });

    const uniqueTags = Array.from(new Set(unknownTags.map(tag => tag.tagName)));
    const files: string[] = [];

    unknownTags.forEach(tag => {
      if (!files.includes(tag.file)) {
        files.push(tag.file);
      }
    });

    // Handle quiet mode
    if (quiet) {
      return writeFinal(unknownTags.length, uniqueTags.length, files.length);
    }

    // Print result
    if (showResult) {
      writeResult(unknownTags);
    }

    // Print line between stats & results
    if (showStats) {
      if (showResult) {
        console.log('....................................');
      }
    }

    // Print stats
    if (showStats) {
      writeStats(stats, files, unknownTags, uniqueTags);
    }

    return writeFinal(unknownTags.length, uniqueTags.length, files.length);
  } catch (error: any) {
    program.error(`Program error: ${error?.errorText}`, { exitCode: -1 });
  }
})();
