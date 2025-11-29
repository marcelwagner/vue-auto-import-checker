import { program } from 'commander';

export async function writeFinalState(error: boolean, text: string, errorCode: number) {
  if (error) {
    return program.error(text, { exitCode: errorCode });
  }
  console.log(text);
}
