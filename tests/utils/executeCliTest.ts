import childProcess from 'node:child_process';
import { expect } from 'vitest';

export async function executeTest(command: string) {
  return new Promise<string>(resolve => {
    try {
      const commandExec = childProcess.exec(command);

      let returnedData: string = '';

      commandExec.stdout?.on('data', data => {
        returnedData = returnedData ? returnedData + data : data;
      });

      commandExec.stderr?.on('data', errorData => {
        resolve(returnedData + errorData);
      });

      commandExec.on('close', () => {
        commandExec.kill('SIGTERM');
        resolve(returnedData);
      });
    } catch (error) {
      expect(error).toBeFalsy();
      resolve('');
    }
  });
}
