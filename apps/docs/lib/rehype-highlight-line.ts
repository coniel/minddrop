/* eslint-disable no-param-reassign */
// Inspired by https://github.com/j0lv3r4/mdx-prism
import { RefractorElement, RefractorRoot, Text } from 'refractor';
import { toHtml } from 'hast-util-to-html';
import { unified } from 'unified';
import parse from 'rehype-parse';

export interface RefractorElementWithLineNumber extends RefractorElement {
  lineNumber: number;
}

export interface TextWithLineNumber extends Text {
  lineNumber: number;
}

interface Numberified {
  nodes: (RefractorElementWithLineNumber | TextWithLineNumber)[];
  lineNumber: number;
}

const lineNumberify = function lineNumberify(
  ast: (RefractorElement | Text)[],
  lineNum = 1,
): Numberified {
  let lineNumber = lineNum;
  const withLineNumbers = ast.reduce(
    (result, originalNode) => {
      const node = originalNode as
        | RefractorElementWithLineNumber
        | TextWithLineNumber;
      if (node.type === 'text') {
        if (node.value.indexOf('\n') === -1) {
          node.lineNumber = lineNumber;
          result.nodes.push(node);
          return result;
        }

        const lines = node.value.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (i !== 0) ++lineNumber;
          if (i !== lines.length - 1 || lines[i].length !== 0) {
            result.nodes.push({
              type: 'text',
              value: i === lines.length - 1 ? lines[i] : `${lines[i]}\n`,
              lineNumber,
            });
          }
        }

        result.lineNumber = lineNumber;
        return result;
      }

      if (node.children) {
        node.lineNumber = lineNumber;
        const processed = lineNumberify(node.children, lineNumber);
        node.children = processed.nodes;
        result.lineNumber = processed.lineNumber;
        result.nodes.push(node);
        return result;
      }

      result.nodes.push(node);
      return result;
    },
    { nodes: [], lineNumber } as Numberified,
  );

  return withLineNumbers;
};

const wrapLines = function wrapLines(
  ast: RefractorElementWithLineNumber[],
  linesToHighlight: number[],
): RefractorElementWithLineNumber[] {
  const highlightAll =
    linesToHighlight.length === 1 && linesToHighlight[0] === 0;
  const allLines = Array.from(new Set(ast.map((x) => x.lineNumber)));
  let i = 0;
  const wrapped = allLines.reduce((nodes, marker) => {
    const line = marker;
    const children = [];
    for (; i < ast.length; i++) {
      if (ast[i].lineNumber < line) {
        nodes.push(ast[i]);
      }

      if (ast[i].lineNumber === line) {
        children.push(ast[i]);
      }

      if (ast[i].lineNumber > line) {
        break;
      }
    }

    nodes.push({
      type: 'element',
      tagName: 'div',
      properties: {
        dataLine: line,
        className: 'highlight-line',
        dataHighlighted:
          linesToHighlight.includes(line) || highlightAll ? 'true' : 'false',
      },
      children,
      lineNumber: line,
    });

    return nodes;
  }, [] as RefractorElementWithLineNumber[]);

  return wrapped;
};

// https://github.com/gatsbyjs/gatsby/pull/26161/files
const MULTILINE_TOKEN_SPAN =
  /<span class="token ([^"]+)">[^<]*\n[^<]*<\/span>/g;

const applyMultilineFix = (ast: RefractorRoot) => {
  // AST to HTML
  let html = toHtml(ast);

  // Fix JSX issue
  html = html.replace(MULTILINE_TOKEN_SPAN, (match, token) =>
    match.replace(/\n/g, `</span>\n<span class="token ${token}">`),
  );

  // HTML to AST
  const hast = unified()
    .use(parse, { emitParseErrors: true, fragment: true })
    .parse(html);

  // @ts-ignore
  return hast.children;
};

export default function highlightLine(ast, lines) {
  const formattedAst = applyMultilineFix(ast) as RefractorElement[];
  const numbered = lineNumberify(formattedAst)
    .nodes as RefractorElementWithLineNumber[];

  return wrapLines(numbered, lines);
}
