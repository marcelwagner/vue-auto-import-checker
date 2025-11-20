#!/usr/bin/env -S npx tsx

import { program } from 'commander';
import checkForUnknownTags, { componentList, vuetifyComponentsImporter } from './index.ts';
import packageJson from './package.json';
import { vueUseComponentsImporter } from './src/tools/vueUseComponentsImporter.ts';

const whisperFinally = async (unknownTags: UnknownTags[]) => {
  if (unknownTags.length >= 1) {
    return program.error(`${new Date().toLocaleString()}: Found ${unknownTags.length} unknown tags`, { exitCode: -1 });
  }

  console.log(`${new Date().toLocaleString()}: No unknown tags found`);
}

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
    .option('--html', 'ignore html tags', true)
    .option('--svg', 'ignore svg tags', true)
    .option('--vue', 'ignore vue tags', true)
    .option('--vueuse', 'ignore vueUse tags', true)
    .option('--vuerouter', 'ignore vueRouter tags', true)
    .version(packageJson.version, '-v, --version', 'output the current version');

  program.parse();

  const options = program.opts();
  // Quiet mode
  const quiet = Boolean(options.quiet);
  // Ignore tags
  const vuetify = Boolean(options.vuetify);
  const html = Boolean(options.html);
  const svg = Boolean(options.svg);
  const vue = Boolean(options.vue);
  const vueUse = Boolean(options.vueuse);
  const vueRouter = Boolean(options.vuerouter);
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
      let toolTags;

      if (tools.includes('vuetify-importer')) {
        toolTags = await vuetifyComponentsImporter();
      } else if (tools.includes('vueuse-importer')) {
        toolTags = await vueUseComponentsImporter();
      } else {
        program.error('No tool found. We provide only "vuetify-importer" at the moment', { exitCode: -1 });
      }

      console.log('\n' + `Found ${toolTags.length} vuetify tags:` + '\n');

      toolTags.forEach(tag => console.log(tag));

      console.log('');
    } catch (error: any) {
      program.error(error?.errorText, { exitCode: -1 });
    }
    return;
  }

  // If only components file is provided, list components and exit

  if (componentsFile && !projectPath) {
    try {
      const componentsList = await componentList(componentsFile);

      console.log('\n' + 'Found components:' + '\n');

      componentsList.forEach(component => console.log(component.rawTag));

      console.log('');
    } catch (error: any) {
      program.error(error?.errorText, { exitCode: -1 });
    }
    return;
  }

  // If project path and components file are provided, check for unknown tags

  try {
    const { unknownTags, stats } = await checkForUnknownTags({
      componentsFile,
      projectPath,
      vuetify,
      html,
      svg,
      vue,
      vueUse,
      vueRouter,
      customTags
    });

    // Handle quiet mode

    if (quiet) {
      return whisperFinally(unknownTags);
    }

    // Print result

    if (showResult) {
      let currentFile = '';

      unknownTags.forEach(({ file, line, tagName, lines }) => {
        if (currentFile !== file) {
          console.log('\n' + `File: ${file}`);
          currentFile = file;
        }
        console.log('\n' + '...');

        lines.forEach((fullLine: string) => console.log(`${fullLine}`));

        console.log('...' + '\n');

        console.log(`Line: ${line}, Tag: <${tagName}>`);
      });

      console.log('');
    }

    // Print stats

    if (showStats) {
      if (showResult) {
        console.log('....................................');
      }

      console.log('\n' + `Found ${unknownTags.length} unknown tags` + '\n');
      Array.from(new Set(unknownTags.map(tag => tag.tagName))).map(tag => console.log(tag));
      console.log('\n' + `Time taken: ${stats.endTime - stats.startTime} ms`);
      console.log(`Files scanned: ${stats.fileCounter}`);
      console.log(`Directories scanned: ${stats.dirCounter}`);
      console.log(`Template files scanned: ${stats.templateFiles}`+ '\n');
    }

    return whisperFinally(unknownTags);
  } catch (error: any) {
    program.error(error?.errorText, { exitCode: -1 });
  }
})();
