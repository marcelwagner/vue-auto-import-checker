import { program } from 'commander';
export function writeFinalState(error, text, errorCode) {
    if (error) {
        program.error(text, { exitCode: errorCode });
    }
    logger.info(text);
}
