import { join } from 'node:path';
import { existsSync, statSync } from 'node:fs';
import { getErrorText, getJsonFileContent } from '../utils/index.ts';
import { configFileName } from '../config/index.ts';
import { program } from 'commander';

/**
 * Read a config file and merge it with the commander options.
 *
 * @param basePath - base path used to resolve the config file location
 * @param commanderOptions - initial commander options
 * @returns merged commander options with values from the config file
 */
export const readConfigFile = async (
  basePath: string,
  commanderOptions: CommanderConfig
): Promise<CommanderConfig> => {
  const { configFile } = commanderOptions;
  try {
    const configFilePath: string = join(basePath, configFile || configFileName);

    // Make sure the file is not too big and blocks more ram as needed
    if (existsSync(configFilePath) && statSync(configFilePath).size <= 2048) {
      const fileConfig: Partial<CommanderConfig> =
        await getJsonFileContent<Partial<CommanderConfig>>(configFilePath);

      return {
        ...commanderOptions,
        ...fileConfig,
        configFile
      };
    } else {
      return {
        ...commanderOptions,
        configFile
      };
    }
  } catch (error) {
    program.error(`ReadConfigFile error ${getErrorText(error)}`, {
      exitCode: -1
    });
  }
};
