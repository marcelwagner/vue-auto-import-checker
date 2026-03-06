import { getUnknownTags } from "./src/getUnknownTags.js";
export default async function (config) {
    return getUnknownTags(config);
}
export * from "./src/cli/index.js";
export * from "./src/utils/index.js";
export * from "./tools/index.js";
