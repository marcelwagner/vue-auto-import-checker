export const unknownMatch = new RegExp(
  /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* unique unknown tags? in [0-9]* lines? in [0-9]* files?/
);
export const noUnknownMatch = new RegExp(
  /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): No unknown tags found/
);
export const noUnknownMatchMd = new RegExp(/# Result[\w\W]*/);
export const uniqueMatch = new RegExp(
  /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* unique tags? in [0-9]* lines? in [0-9]* files?/
);
export const getFrameworkMatcher = (framework: string) =>
  new RegExp(
    `[0-9]{1,2}\\/[0-9]{1,2}\\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* ${framework} tags?`
  );
export const componentsMatch = new RegExp(/Found [0-9]* components?/);
