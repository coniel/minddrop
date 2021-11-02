// Inspired by https://github.com/j0lv3r4/mdx-prism

import rangeParser from 'parse-numeric-range';
import { visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import { refractor } from 'refractor';
import highlightLine from './rehype-highlight-line';
import highlightWord from './rehype-highlight-word';

export default () => {
  return (tree) => {
    visit(tree, 'element', visitor);
  };

  function visitor(node, index, parent) {
    if (
      !parent ||
      parent.tagName !== 'pre' ||
      node.tagName !== 'code' ||
      !node.properties.className
    ) {
      return;
    }

    const [, lang] = node.properties.className[0].split('-');

    if (lang === 'hero') {
      return;
    }

    const codeString = toString(node);
    const result = refractor.highlight(codeString, lang);
    const linesToHighlight = rangeParser(node.properties.line || '0');
    const highlightedLines = highlightLine(result, linesToHighlight);
    const content = highlightWord(highlightedLines);

    // eslint-disable-next-line no-param-reassign
    node.children = content;
  }
};
