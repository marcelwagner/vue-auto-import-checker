type UnknownTags = {
  line: number;
  tagName: string;
  lines: UnknownTagLine[];
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

type ComponentTag = {
  tag: string;
  rawTag: string;
};

type ComponentSearch = {
  stats: Stats;
  unknownTags: UnknownTags[];
  componentsList: ComponentList[];
};

type IgnoreListConfig = {
  noHtml: boolean;
  noSvg: boolean;
  noVue: boolean;
  noVueRouter: boolean;
  frameworks: Frameworks[];
  customTags: string[];
  customTagsFileContent: string[];
  userGeneratedPath: string;
  basePath: string;
};

type FrameworkTools = {
  [name: string]: FrameworkToolItem;
};

type FrameworkToolItem = {
  name: string;
  file: string;
  toolName: string;
  tool: (pwd: string) => Promise<string[]>;
  tags: string[];
};

type Frameworks = 'vuetify' | 'vueUse' | 'quasar';
