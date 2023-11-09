import fs from 'fs';
import { parse, ElementNode } from 'svg-parser';
import { filter, unwrap } from './utils';

const files = fs.readdirSync('eva-icons');

let iconsJsx = 'export const UiIcons = {';
let svgFilesSize = 0;

files.forEach((file) => {
  const filePath = `eva-icons/${file}`;
  let iconName = file.slice(0, -'-outline.svg'.length);
  const contents = fs.readFileSync(filePath, { encoding: 'utf8' });
  svgFilesSize += fs.statSync(filePath).size;

  // 'trash-2' is used as the default trash icon
  // so we swap them around.
  if (iconName === 'trash-2') {
    iconName = 'trash';
  } else if (iconName === 'trash') {
    iconName = 'trash-2';
  }

  const rooElement = unwrap(parse(contents));

  const nodes =
    rooElement.tagName === 'g'
      ? filter(rooElement.children.map((child) => unwrap(child as ElementNode)))
      : [rooElement];

  let iconJsx = nodes.length > 1 ? `<>` : '';

  nodes.forEach((node) => {
    delete node.properties?.class;
    iconJsx = `${iconJsx}<${node.tagName} ${Object.entries(
      node.properties || {},
    ).reduce(
      (properties, [key, value]) => `${properties} ${key}="${value}"`,
      '',
    )} />`;
  });

  iconJsx = nodes.length > 1 ? `${iconJsx}</>` : iconJsx;

  const iconKey = iconName.includes('-') ? `'${iconName}'` : iconName;
  iconsJsx = `${iconsJsx} ${iconKey}: ${iconJsx},`;
});

iconsJsx = `${iconsJsx}};`;

const outputFilePath = '../icons/src/ui-icons.min.tsx';

fs.writeFileSync(outputFilePath, iconsJsx);

// Let's see how much we saved
const minifiedSize = fs.statSync(outputFilePath).size;

console.log(`original: ${Math.round(svgFilesSize / 1024)} KB`);
console.log(`minified: ${Math.round(minifiedSize / 1024)} KB`);
console.log(`saved:    ${Math.round((svgFilesSize - minifiedSize) / 1024)} KB`);
