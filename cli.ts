#!/usr/bin/env -S npx tsx

import { program } from 'commander';
import checkForUnknownTags, { componentList } from './index';
import packageJson from './package.json';

const whisperFinally = async (unknownTags: UnknownTags[]) => {
  if (unknownTags.length >= 1) {
    return program.error(`Found ${unknownTags.length} unknown tags.`, { exitCode: -1 });
  }

  console.log('No unknown tags found');
}

(async () => {
  program
    .option('-v --version')
    .option('-s --stats', 'print stats after check', false)
    .option('-r --result', 'print result after check', false)
    .option('-q --quiet', 'suppress output', false)
    .option(
      '-c --components-file <file>',
      'write the file name or path to the file (relative to the current working directory)',
      './components.d.ts'
    )
    .option(
      '-p --project-path <path>',
      'path to the vue project files to look for vue components (relative to the current working directory)',
      ''
    );

  program.parse();

  const options = program.opts();

  const version = Boolean(options.version);
  const quiet = Boolean(options.quiet);
  const showStats = Boolean(options.stats);
  const showResult = Boolean(options.result);
  const componentsFile = options.componentsFile;
  const projectPath = options.projectPath;

  if (version) {
    console.log(`Version: ${packageJson.version}`);
    return;
  }

  if (componentsFile && !projectPath) {
    try {
      const componentsList = await componentList(componentsFile);

      if (showResult) {
        console.log('\n' + 'Found components:');
        console.log('');

        componentsList.forEach(component => console.log(component.rawTag));

        console.log('');
      }
    } catch (error: any) {
      program.error(error?.errorText, { exitCode: -1 });
    }
    return;
  }

  try {
    const { componentsList, unknownTags, stats } = await checkForUnknownTags(
      componentsFile,
      projectPath
    );

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
        console.log('');
        console.log('...');

        lines.forEach((fullLine: string) => {
          console.log(`${fullLine}`);
        });

        console.log('...');
        console.log('');

        console.log(`Line: ${line}, Tag: <${tagName}>`);
      });

      console.log('');
    }

    if (showStats) {
      console.log(`${new Date().toLocaleString()}`);
      console.log('');
      console.log('Statistics:');
      console.log(`- Time taken: ${stats.endTime - stats.startTime} ms`);
      console.log(`- Files scanned: ${stats.fileCounter}`);
      console.log(`- Template files scanned: ${stats.templateFiles}`);
      console.log(
        `- Components in catalog file found: (${componentsList.length}) ${componentsList.map(c => c.rawTag).join(', ')}`
      );
      console.log('');
    }

    return whisperFinally(unknownTags);
  } catch (error: any) {
    program.error(error?.errorText, { exitCode: -1 });
  }
})();
