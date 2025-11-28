import fsPromise from 'node:fs/promises';

export async function getFileContent(filePath: string) {
  try {
    return fsPromise.readFile(filePath, 'utf8');
  } catch (error) {
    return Promise.reject('Error getting file content ' + error);
  }
}

export async function getJsonFileContent(filePath: string): Promise<string[]> {
  try {
    const localVueUsePluginContent = await getFileContent(filePath);
    return JSON.parse(localVueUsePluginContent);
  } catch (error) {
    return Promise.reject('Error getting json file content ' + error);
  }
}
