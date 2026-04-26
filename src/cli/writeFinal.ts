import { program } from 'commander';
import { userConfig } from '../config/index.ts';
import { logger } from '../utils/index.ts';

/**
 * Write the final state of the CLI to the console.
 *
 * @param error - whether there was an error
 * @param text - text to write
 * @param errorCode - exit code
 * @param json - JSON object to log
 */
export function writeFinalState(
  error: boolean,
  text: string,
  errorCode: number,
  json: Record<string, unknown> = {}
): void {
  if (error && userConfig.outputFormat === 'text') {
    program.error(text, { exitCode: errorCode });
  }

  logger.exit(text, json);
}
