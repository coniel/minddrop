import fs from 'fs';

interface IconMetadata {
  tags: string[];
  categories: string[];
}

// [name, category indexes, label indexes]
type MinifiedIconMetadata = [string, number[], number[]];

/**
 * Used to minify the Lucide icon set (https://lucide.dev)
 * and associtated JSON metadata.
 *
 * Merges all metadata into a single JSON file and generates
 * a React component per icon combined into a single file.
 */

const iconsSrc = 'lucide-icons';
const categoriesSrc = 'categories';

const svgOpen = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>`;

const svgClose = `</svg>`;
const svgClose2 = `</svg>
`;

const files = fs.readdirSync(iconsSrc);
const svgFiles = files.filter((file) => file.endsWith('.svg'));
const jsonFiles = files.filter((file) => file.endsWith('.json'));
const categoryFiles = fs.readdirSync(categoriesSrc);

let iconsJsx = 'export const ContentIcons = {';
let svgFilesSize = 0;

const categoryNames = categoryFiles.reduce<Record<string, string>>(
  (map, file) => {
    const categoryKey = file.slice(0, -5);
    const category = JSON.parse(
      fs.readFileSync(`${categoriesSrc}/${file}`, { encoding: 'utf8' }),
    ) as { title: string };

    return {
      ...map,
      [categoryKey]: category.title,
    };
  },
  {},
);

svgFiles.forEach((file) => {
  const iconPath = `${iconsSrc}/${file}`;
  svgFilesSize += fs.statSync(iconPath).size;
  const content = fs.readFileSync(iconPath, { encoding: 'utf8' });
  const iconName = file.slice(0, -4);
  const componentJsx = content
    .slice(
      svgOpen.length,
      content.endsWith(svgClose) ? -svgClose.length : -svgClose2.length,
    )
    .replaceAll('\n', '')
    .replaceAll('  ', '');

  const iconKey = iconName.includes('-') ? `'${iconName}'` : iconName;

  iconsJsx = ` ${iconsJsx}${iconKey}:<>${componentJsx}</>,`;
});

iconsJsx = `${iconsJsx}};`;

const categories: string[] = [];
const labels: string[] = [];
const iconsMetadata: MinifiedIconMetadata[] = [];

let jsonFilesSize = 0;

jsonFiles.forEach((file) => {
  const filePath = `${iconsSrc}/${file}`;
  const iconName = file.slice(0, -5);
  const iconCategoryIndexes: number[] = [];
  const iconLabelIndexes: number[] = [];
  jsonFilesSize += fs.statSync(filePath).size;
  const meta = JSON.parse(
    fs.readFileSync(filePath, { encoding: 'utf8' }),
  ) as unknown as IconMetadata;

  meta.categories.forEach((category) => {
    const categoryTitle = categoryNames[category] || category;

    if (!categories.includes(categoryTitle)) {
      categories.push(categoryTitle);
    }

    iconCategoryIndexes.push(categories.indexOf(categoryTitle));
  });

  meta.tags.forEach((tag) => {
    if (!labels.includes(tag)) {
      labels.push(tag);
    }

    iconLabelIndexes.push(labels.indexOf(tag));
  });

  iconsMetadata.push([iconName, iconCategoryIndexes, iconLabelIndexes]);
});

const minifiedIconsMetadata = {
  categories,
  labels,
  icons: iconsMetadata,
};

const outputDir = '../icons/src';
const iconsOutputFile = `${outputDir}/content-icons.min.tsx`;
const metaOutputFile = `${outputDir}/content-icons.min.json`;

fs.writeFileSync(iconsOutputFile, iconsJsx);
fs.writeFileSync(metaOutputFile, JSON.stringify(minifiedIconsMetadata));

const minifiedIconsSize = fs.statSync(iconsOutputFile).size;
const minifiedIconsMetaSize = fs.statSync(metaOutputFile).size;

console.log('--- Icons ---');
console.log(`original: ${Math.round(svgFilesSize / 1024)} KB`);
console.log(`minified: ${Math.round(minifiedIconsSize / 1024)} KB`);
console.log(
  `saved:    ${Math.round((svgFilesSize - minifiedIconsSize) / 1024)} KB`,
);
console.log('');
console.log('--- Metadata ---');
console.log(`original: ${Math.round(jsonFilesSize / 1024)} KB`);
console.log(`minified: ${Math.round(minifiedIconsMetaSize / 1024)} KB`);
console.log(
  `saved:    ${Math.round((jsonFilesSize - minifiedIconsMetaSize) / 1024)} KB`,
);
console.log('');
console.log('--- Total ---');
console.log(
  `original: ${Math.round((jsonFilesSize + svgFilesSize) / 1024)} KB`,
);
console.log(
  `minified: ${Math.round(
    (minifiedIconsMetaSize + minifiedIconsSize) / 1024,
  )} KB`,
);
console.log(
  `saved:    ${Math.round(
    (jsonFilesSize + svgFilesSize - minifiedIconsMetaSize - minifiedIconsSize) /
      1024,
  )} KB`,
);
