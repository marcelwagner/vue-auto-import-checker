// Extend the NodeJS global type to include config
export const thisIsAModule = true;

declare global {
  var debug: boolean;
  var logger: CustomLogger;
  var stats: Stats;
  var quiet: boolean;
}
