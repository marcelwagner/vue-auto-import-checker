import fs from 'node:fs';
import path from 'node:path';
import { getJsonFileContent } from './fileUtils.ts';

export async function getCustomTagList(userGeneratedPath: string, basePath: string, file: string) {
  const localVueUsePlugin = path.join(userGeneratedPath, `${file}.json`);
  const localVueUsePluginExists = fs.existsSync(localVueUsePlugin);

  return localVueUsePluginExists
    ? await getJsonFileContent(localVueUsePlugin)
    : await getJsonFileContent(path.join(basePath, 'src/plugins', `${file}.json`));
}
