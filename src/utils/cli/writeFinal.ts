import { program } from 'commander';

export async function writeFinalState(error: boolean, text: string, errorCode: number) {
  logger.debug('');
  logger.debug('-----------------------------------');
  logger.debug('Show Result line:');
  logger.debug('');

  if (error) {
    return program.error(text, { exitCode: errorCode });
  }
  logger.info(text);
}
