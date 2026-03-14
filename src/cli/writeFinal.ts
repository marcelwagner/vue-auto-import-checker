import { program } from 'commander';

/**
 * Write the final state of the CLI to the console.
 *
 * @param error - whether there was an error
 * @param text - text to write
 * @param errorCode - exit code
 */
export function writeFinalState(error: boolean, text: string, errorCode: number): void {
  if (error) {
    program.error(text, { exitCode: errorCode });
  }
  logger.info(text);
}
