export function writeComponents(componentsList: ComponentTag[]) {
  if (componentsList.length >= 1) {
    console.log('');
    console.log(`Found component${componentsList.length >= 2 ? 's' : ''}:`);
    console.log('');

    componentsList.forEach(component => console.log(component.rawTag));

    console.log('');
    console.log(`Total : ${componentsList.length}`);
    console.log('');
  } else {
    console.log('No components found.');
  }
}
