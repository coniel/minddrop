import fs from 'fs';
import path from 'path';
import { visit } from 'unist-util-visit';

const ROOT_PATH = process.cwd();
const HERO_PATH = 'components/demos';

export default () => {
  return (tree) => {
    visit(tree, 'code', visitor);
  };

  function visitor(node) {
    if (!node.meta) return;

    const [, templateName] = node.meta && node.meta.split('template=');

    if (!templateName) return;

    const templatePath = path.join(
      `${ROOT_PATH}/${HERO_PATH}/${templateName}.jsx`,
    );
    let source = fs.readFileSync(path.join(templatePath), 'utf8');
    source = source
      .replace('@modulz/design-system', '@stitches/react')
      .replace(', theme } from', ' } from')
      .replace(/className={`\${theme}`}/g, '');

    // eslint-disable-next-line no-param-reassign
    node.value = source;
  }
};
