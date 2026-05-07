# Config File

Default config file name is `vuectl.config.json`. The config file should be placed in the root of your project, from
where you run the command. You do not need to specify the file-name when running the command.

The following is a config file example:

```json5
{
  componentsFile: './components.d.ts',
  projectPaths: ['./src', './lib'],
  tool: '',
  negateKnown: [],
  knownFrameworks: [],
  knownTags: [],
  knownTagsFile: '',
  cachePath: '',
  importsKnown: false,
  basePath: '',
  kafka: false,
  outputFormat: 'text',
  quiet: false,
  showStats: false,
  showResult: false,
  debug: false
}
```

You can also specify the path to the config file using the `--config-file` option. In this case you can name the file
whatever you want.

```sh
npx vue-auto-import-checker --config-file ./path/to/my.config.json
```
