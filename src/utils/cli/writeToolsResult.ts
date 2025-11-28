export function writeToolsResult(toolName: string, toolTags: string[]) {
  if (toolTags.length >= 1) {
    console.log('');
    console.log(`Found ${toolName} tag${toolTags.length ? 's' : ''}:`);
    console.log('');

    toolTags.forEach(tag => console.log(tag));

    console.log('');
    console.log(`Found ${toolName} tag${toolTags.length ? 's' : ''}: ${toolTags.length}`);
    console.log('');
  } else {
    console.log(`No ${toolName} tags found.`);
  }
}
