import fsPromise from 'node:fs/promises';

/**
 * Read a file as UTF-8 text.
 *
 * This helper wraps `fs/promises.readFile` to provide a consistent
 * promise-based API and unified error message on failure.
 *
 * @param filePath - path to the file to read
 * @returns promise that resolves with the file content as a string
 * @throws rejects with a prefixed error string if reading fails
 */
export async function getFileContent(filePath: string) {
  try {
    // Read the file using UTF-8 encoding and return the resulting string.
    return fsPromise.readFile(filePath, 'utf8');
  } catch (error) {
    // Normalize the rejection to a readable string so callers get a consistent error shape.
    return Promise.reject('Error getting file content ' + error);
  }
}

/**
 * Load and parse a JSON file.
 *
 * This function reads the file using `getFileContent` and parses the
 * content with `JSON.parse`. It rejects with a descriptive error
 * message on read or parse failures.
 *
 * @param filePath - path to the JSON file
 * @returns promise that resolves with the parsed JSON (expected as `string[]` in current usage)
 * @throws rejects with a prefixed error string if reading or parsing fails
 */
export async function getJsonFileContent(filePath: string): Promise<string[]> {
  try {
    const jsonFileContent = await getFileContent(filePath);
    // Parse the JSON text and return the resulting value.
    return JSON.parse(jsonFileContent);
  } catch (error) {
    // Provide a consistent rejection message for callers to handle.
    return Promise.reject('Error getting json file content ' + error);
  }
}
