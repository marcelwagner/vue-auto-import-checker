export const normalizeMatcher = new RegExp(/[_\- ]/g);
export const fullOpeningTagMatcher = new RegExp(/<(\w+?[^ ]+?)\W*?>/);
export const explicitClosingTagMatcher = new RegExp(/<\/([\w-]+)>/);
export const falseOpeningTagMatcher = new RegExp(
  /[=:"]+?[^</]+?<\s*([\w-]+)\s*(?=>)|[=:"]+?[^</]+?<([\w-]*?)<\s*?\W*?([\w-]+?)\W*?\s*?>/
);
export const smallerMatcher = new RegExp(/</);
export const openingTagMatcher = new RegExp(/<([\w-]+)/g);
export const importMatcher = new RegExp(
  /import\s+((?:[A-Za-z_$][\w$]*)\s*(?:,\s*)?)?(?:\*\s+as\s+([A-Za-z_$][\w$]*)|\{\s*([^}]+?)\s*})?\s*from\s*(['"])([^'"]+)\4/g
);
export const importReplaceMatcher = new RegExp(/(as|default| |\n)/g);
export const importListReplaceMatcher = new RegExp(/(as|default|,| )/g);
