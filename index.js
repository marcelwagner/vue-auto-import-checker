import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getUnknownTags } from "./src/getUnknownTags.js";
export default async function (config) {
    return getUnknownTags({
        ...config,
        basePath: config.basePath ?? dirname(fileURLToPath(import.meta.url))
    });
}
export * from "./src/cli/index.js";
export * from "./src/config/index.js";
export * from "./src/getComponentsList.js";
export * from "./src/getTags.js";
export * from "./src/getToolTags.js";
export * from './src/getUnknownTags.js';
export * from "./src/tools/index.js";
export * from "./src/utils/index.js";
export { getUnknownTags };
