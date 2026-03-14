import { getUnknownTags } from "./src/getUnknownTags.js";
export default async function (config) {
    return getUnknownTags(config);
}
export * from "./src/cli/index.js";
export * from "./src/tools/index.js";
export * from "./src/utils/index.js";
