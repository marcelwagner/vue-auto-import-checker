interface VueCtlConfig {
  componentsFile?: string;
  projectPaths?: string[];
  tool?: string;
  negateKnown?: Known[];
  knownFrameworks?: Framework[];
  knownTags?: string[];
  knownTagsFile?: string;
  cachePath?: string;
  importsKnown?: boolean;
  basePath?: string;
  kafka?: boolean;
  outputFormat: OutputFormat;
  quiet?: boolean;
  showStats?: boolean;
  showResult?: boolean;
  debug?: boolean;
}

type AppConfig = {
  repoUrl: string;
  toolsFileExt: string;
  defaultCachePath: string;
};

type CommanderConfig = {
  configFile: string;

  componentsFile: string;
  projectPaths: string[];

  cachePath: string;
  tool: string;

  showStats: boolean;
  showResult: boolean;
  quiet: boolean;

  knownTags: string[];
  knownTagsFile: string;
  knownFrameworks: string[];
  negateKnown: string[];

  kafka: boolean;

  outputFormat: string;

  importsKnown: boolean;
  debug: boolean;
  showConfig: boolean;
};

type InternalConfig = CommanderConfig & {
  negateKnown: Known[];
  knownFrameworks: Framework[];
  outputFormat: OutputFormat;
  basePath: string;
};
