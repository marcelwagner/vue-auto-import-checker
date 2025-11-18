import getUnknownTags from './src/getUnknownTags';

export default async function (componentsFile: string, projectPath: string, quiet = false) {
  if (componentsFile && projectPath) {
    return getUnknownTags(componentsFile, projectPath, quiet);
  } else {
    return Promise.reject('componentsFile and projectPath are required');
  }
}

export * as getUnknownTags from './src/getUnknownTags';
export * from './src/plugins/componentList';
export * from './src/plugins/htmlTags';
export * from './src/plugins/vuetifyTags';
