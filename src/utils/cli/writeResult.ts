export const writeResult = (unknownTags: UnknownTags[]) => {
  let currentFile = '';

  unknownTags.forEach(({ file, line, tagName, lines }) => {
    if (currentFile !== file) {
      console.log('');
      console.log(`File: ${file}`);

      currentFile = file;
    }

    console.log('');

    lines.forEach(({ text, index }) => console.log(`${index <= 9 ? '0' : ''}${index}: ${text}`));

    console.log('');
    console.log(`Line: ${line}, Tag: <${tagName}>`);
  });

  console.log('');
};
