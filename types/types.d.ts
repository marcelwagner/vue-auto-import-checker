type Tag = {
  line: number;
  tagName: string;
  lines: UnknownTagLine[];
  file: string;
  known: boolean;
  knownSource: KnownSource[];
};

type KnownSource = {
  source: Source;
  known: boolean;
  file: string;
};

type UnknownTagLine = {
  text: string;
  index: number;
};

type Stats = {
  fileCounter: number;
  dirCounter: number;
  templateFiles: number;
  startTime: number;
  endTime: number;
};

type ComponentImport = {
  tag: string;
  path: string;
};

type KnownListProps = {
  negateKnown: Known[];
  knownFrameworks: Framework[];
  knownTags: string[];
  knownTagsFile: string;
  cachePath: string;
};

type IdentifiedTagsListProps = {
  knownTagsList: KnownList[];
  componentsList: string[];
  componentsFile: string;
  tags: Tag[];
  importsKnown: boolean;
};

type KnownList = {
  name: Source;
  tags: string[];
  known: boolean;
  file: string;
};

type FrameworkToolItem = {
  name: string;
  file: string;
  tool: (pwd: string, userGeneratedPath: string) => Promise<string[]>;
  tags: string[];
  source: string;
};

type BaseTags = {
  name: string;
  tags: string[];
  source: string;
};

type InternalConfig = CommanderInit & {
  negateKnown: Known[];
  knownFrameworks: Framework[];
  outputFormat: OutputFormat;
  basePath: string;
};

type UserConfig = InternalConfig & {
  set(config: InternalConfig): void;
};

type CommanderInit = {
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

type OutputFormat = 'text' | 'md' | 'json';

type Framework =
  | 'vuetify'
  | 'vueuse'
  | 'quasar'
  | 'nuxt'
  | 'primevue'
  | 'naiveui';
type Known = 'html' | 'svg' | 'vue' | 'vuerouter';
type UserGenerated = 'cli' | 'file';
type Source =
  | Framework
  | Known
  | UserGenerated
  | 'import'
  | 'components'
  | 'unknown';
