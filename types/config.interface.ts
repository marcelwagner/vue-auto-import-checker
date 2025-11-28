export interface VAIC_Config {
  componentsFile: string;
  projectPath: string;
  userGeneratedPath: string;
  customTags: string[];
  noHtml: boolean;
  noSvg: boolean;
  noVue: boolean;
  noVueRouter: boolean;
  vuetify: boolean;
  vueUse: boolean;
  basePath: string;
  quiet?: boolean;
}
