import childProcess from 'node:child_process';
import { expect } from 'vitest';

function resolveCliCommand(command: string): string {
  const npxPrefix = /^npx\s+vue-auto-import-checker\b/;

  if (!npxPrefix.test(command)) {
    return command;
  }

  return command.replace(npxPrefix, 'node ./dist/cli.js');
}

export async function executeTest(command: string) {
  return new Promise<{ success: string; error: string }>(resolve => {
    try {
      const commandExec = childProcess.exec(resolveCliCommand(command));

      let returnedData: string = '';
      let errorData: string = '';

      commandExec.stdout?.on('data', (data: unknown): void => {
        returnedData = returnedData + data;
      });

      commandExec.stderr?.on('data', (data: unknown): void => {
        errorData = errorData + data;
      });

      commandExec.on('close', (): void => {
        commandExec.kill('SIGTERM');
        resolve({ success: returnedData, error: errorData });
      });
    } catch (error) {
      expect(error).toBeFalsy();
      resolve({ success: '', error: (error as any).toString() });
    }
  });
}
