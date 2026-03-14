import childProcess from 'node:child_process';
import { expect } from 'vitest';

export async function executeTest(command: string) {
  return new Promise<{ success: string; error: string }>(resolve => {
    try {
      const commandExec = childProcess.exec(command);

      let returnedData: string = '';
      let errorData: string = '';

      commandExec.stdout?.on('data', data => {
        returnedData = returnedData + data;
      });

      commandExec.stderr?.on('data', data => {
        errorData = errorData + data;
      });

      commandExec.on('close', () => {
        commandExec.kill('SIGTERM');
        resolve({ success: returnedData, error: errorData });
      });
    } catch (error) {
      expect(error).toBeFalsy();
      resolve({ success: '', error: (error as any).toString() });
    }
  });
}
