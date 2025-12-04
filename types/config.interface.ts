export interface VAIC_Config {
  componentsFile: string;
  projectPath: string;
  userGeneratedPath: string;
  customTags: string[];
  customTagsFile: string;
  noHtml: boolean;
  noSvg: boolean;
  noVue: boolean;
  noVueRouter: boolean;
  frameworks: Frameworks[];
  basePath: string;
  quiet?: boolean;
  debug?: boolean;
}
