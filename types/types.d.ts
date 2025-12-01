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
  vuetify: boolean;
  vueUse: boolean;
  quasar: boolean;
  customTags: string[];
  customTagsFileContent: string[];
  userGeneratedPath: string;
  basePath: string;
};
