import { program } from 'commander';

/**
 * Write the final state of the CLI to the console.
 * @param error
 * @param text
 * @param errorCode
 */
export function writeFinalState(error: boolean, text: string, errorCode: number) {
  if (error) {
    program.error(text, { exitCode: errorCode });
  }
  logger.info(text);
}
