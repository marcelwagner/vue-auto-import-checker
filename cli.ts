#!/usr/bin/env -S npx tsx

import { program } from 'commander';
import checkForUnknownTags, { componentList } from './index.ts';
import packageJson from './package.json';

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
    .option('-s --stats', 'print stats after check', false)
    .option('-r --result', 'print result after check', false)
    .option('-q --quiet', 'suppress output', false)
    .option('--customtags [customtags...]', 'ignore these tags', [])
    .option('--vuetify', 'ignore vuetify tags', false)
    .option('--html', 'ignore html tags', true)
    .version(packageJson.version, '-v, --version', 'output the current version');

  program.parse();

  const options = program.opts();

  const quiet = Boolean(options.quiet);
  const vuetify = Boolean(options.vuetify);
  const html = Boolean(options.html);
  const customTags = options.customtags as string[];
  const showStats = Boolean(options.stats);
  const showResult = Boolean(options.result);
  const componentsFile = options.componentsFile;
  const projectPath = options.projectPath;

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

  try {
    const { unknownTags, stats } = await checkForUnknownTags({
      componentsFile,
      projectPath,
      vuetify,
      html,
      customTags
    });

    if (quiet) {
      return whisperFinally(unknownTags);
    }

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

    if (showStats) {
      if (showResult) {
        console.log('....................................');
      }

      console.log('\n' + `Found ${unknownTags.length} unknown tags` + '\n');
      unknownTags.map(tag => console.log(tag.tagName));

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
