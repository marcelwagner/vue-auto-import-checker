export interface VAIC_Config {
  componentsFile: string;
  projectPaths: string[];
  tool: string;
  negateKnown: Known[];
  knownFrameworks: Framework[];
  knownTags: string[];
  knownTagsFile: string;
  cachePath: string;
  importsKnown: boolean;
  basePath?: string;
  kafka?: boolean;
  outputFormat: OutputFormat;
  quiet?: boolean;
  showStats?: boolean;
  showResult?: boolean;
  debug?: boolean;
}
