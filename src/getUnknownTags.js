import { userConfig } from "./config/index.js";
import { getTags } from "./getTags.js";
import { getUnknownTagsList, statistics } from "./utils/index.js";
export async function getUnknownTags(config) {
    try {
        userConfig.set(config);
        statistics.start();
        const tagsList = await getTags(userConfig);
        const unknownTagsList = await getUnknownTagsList(tagsList);
        statistics.end();
        return unknownTagsList;
    }
    catch (error) {
        return Promise.reject({ errorText: `Error in getUnknownTags: ${error}` });
    }
}
