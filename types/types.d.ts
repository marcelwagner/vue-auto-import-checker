type UnknownTagsOfFile = {
  line: number;
  tagName: string;
  lines: string[]
}

type UnknownTags = UnknownTagsOfFile & {
  file: string;
}

type Stats = {
  fileCounter: number;
  dirCounter: number;
  templateFiles: number;
  startTime: number;
  endTime: number;
}

type ComponentTag = {
  tag: string;
  rawTag: string
}

type ComponentSearch = {
  stats: Stats;
  unknownTags: UnknownTags[];
  componentsList: ComponentList[];
}
