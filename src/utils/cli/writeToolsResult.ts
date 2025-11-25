export const writeToolsResult = (tools: string[], toolTags: string[]) => {
  const vuetify = tools.includes('vuetify-importer');

  console.log('');
  console.log(
    `Found ${toolTags.length} ${vuetify ? 'vuetify' : 'vueuse'} tag${toolTags.length ? 's' : ''}: ${toolTags.length}`
  );
  console.log('');

  toolTags.forEach(tag => console.log(tag));

  console.log('');
};
