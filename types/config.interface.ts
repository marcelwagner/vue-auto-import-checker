export interface VAIC_Config {
  componentsFile: string;
  projectPath: string;
  customTags: string[];
  noHtml?: boolean;
  noSvg?: boolean;
  noVue?: boolean;
  noVueRouter?: boolean;
  vuetify?: boolean;
  vueUse?: boolean;
  quiet?: boolean;
  basePath: string;
}
