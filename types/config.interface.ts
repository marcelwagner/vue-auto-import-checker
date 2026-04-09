export interface VAIC_Config {
  componentsFile: string;
  projectPaths: string[];
  negateKnown: Known[];
  knownFrameworks: Framework[];
  knownTags: string[];
  knownTagsFile: string;
  cachePath: string;
  importsKnown: boolean;
  basePath?: string;
  debug?: boolean;
  kafka?: boolean;
}

export interface VAIC_ComponentSearch {
  stats: Stats;
  tagsList: Tag[];
  unknownTagsList: Tag[];
  componentsList: string[];
}
