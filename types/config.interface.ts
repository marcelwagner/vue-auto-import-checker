export interface VAIC_Config {
  componentsFile: string;
  projectPath: string;
  negateKnown: Known[];
  knownFrameworks: Framework[];
  knownTags: string[];
  knownTagsFile: string;
  cachePath: string;
  importsKnown: boolean;
  basePath?: string;
  debug?: boolean;
}
