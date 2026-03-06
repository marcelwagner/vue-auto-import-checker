import { program } from 'commander';

export function writeFinalState(error: boolean, text: string, errorCode: number) {
  if (error) {
    program.error(text, { exitCode: errorCode });
  }
  logger.info(text);
}
