import { program } from 'commander';
import { userConfig } from "../config/index.js";
import { logger } from "../utils/index.js";
export function writeFinalState(error, text, errorCode, json = {}) {
    if (error && userConfig.outputFormat === 'text') {
        program.error(text, { exitCode: errorCode });
    }
    logger.exit(text, json);
}
