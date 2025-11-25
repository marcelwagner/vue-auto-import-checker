export const writeComponents = (componentsList: ComponentTag[]) => {
  console.log('');
  console.log(`Found component${componentsList.length >= 2 ? 's' : ''}:`);
  console.log('');

  componentsList.forEach(component => console.log(component.rawTag));

  console.log('');
};
