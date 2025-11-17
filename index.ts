import itterateDirectoryRecursive from './src/itterateDirectoryRecursive';

export default async function (componentsFile: string, projectPath: string, quiet = false) {
  if (componentsFile && projectPath) {
    return itterateDirectoryRecursive(componentsFile, projectPath, quiet);
  } else {
    return Promise.reject('componentsFile and projectPath are required');
  }
}

export * as itterateDirectoryRecursive from './src/itterateDirectoryRecursive';
export * from './src/plugins/componentList';
export * from './src/plugins/htmlTags';
export * from './src/plugins/vuetifyTags';
