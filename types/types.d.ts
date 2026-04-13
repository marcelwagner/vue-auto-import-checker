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

type WriteStatsProps = {
  stats: Stats;
  filesList: string[];
  tagsList: Tag[];
  uniqueTagsList: string[];
  showResult: boolean;
  kafka: boolean;
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

type CommanderInit = {
  knownFrameworks: string[];
  negateKnown: string[];
  knownTags: string[];
  knownTagsFile: string;

  showStats: boolean;
  showResult: boolean;
  componentsFile: string;
  projectPaths: string[];

  tool: string;
  cachePath: string;

  kafka: boolean;

  importsKnown: boolean;
  quiet: boolean;
  debug: boolean;
};

type CustomLogger = {
  info: (message: string) => void;
  debug: (message: string) => void;
};

type Framework = 'vuetify' | 'vueuse' | 'quasar' | 'nuxt' | 'primevue' | 'naiveui';
type Known = 'html' | 'svg' | 'vue' | 'vuerouter';
type UserGenerated = 'cli' | 'file';
type Source = Framework | Known | UserGenerated | 'import' | 'components' | 'unknown';
