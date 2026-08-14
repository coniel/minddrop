import {
  CodeElement,
  DefinitionElement,
  HeadingElement,
  HtmlElement,
  MathElement,
  ParagraphElement,
  TableCellElement,
  TableColumnAlignment,
  TableElement,
  TableRowElement,
  ThematicBreakElement,
  UnsupportedElement,
} from '../element-configs';
import { parseInlineMarkdown } from '../parseInlineMarkdown';
import { Element } from '../types';
import { generateElement } from '../utils';
import { MdastNode, sliceNode } from './mdast';

/**
 * Maps a leaf mdast block into an element. Containers are handled by the
 * caller, which turns them into ancestry frames rather than elements.
 *
 * @param node - The mdast node.
 * @param source - The document the node was parsed from.
 * @returns The block element.
 */
export function mapBlockElement(node: MdastNode, source: string): Element {
  const children = node.children || [];

  switch (node.type) {
    case 'paragraph':
      return generateElement<ParagraphElement>('paragraph', {
        children: parseInlineMarkdown(children, source),
      });

    case 'heading':
      return generateElement<HeadingElement>('heading', {
        level: (node.depth || 1) as HeadingElement['level'],
        syntax: readHeadingSyntax(node, source),
        children: parseInlineMarkdown(children, source),
      });

    case 'thematicBreak':
      return generateElement<ThematicBreakElement>('thematic-break', {
        syntax: sliceNode(node, source),
      });

    case 'code':
      return generateElement<CodeElement>('code', {
        lang: node.lang,
        meta: node.meta,
        ...readFence(node, source),
        children: [{ text: node.value || '' }],
      });

    case 'math':
      return generateElement<MathElement>('math', {
        meta: node.meta,
        children: [{ text: node.value || '' }],
      });

    case 'html':
      return generateElement<HtmlElement>('html', {
        value: node.value || '',
      });

    case 'definition':
      return generateElement<DefinitionElement>('definition', {
        identifier: node.identifier || '',
        label: node.label,
        url: node.url || '',
        title: node.title,
      });

    case 'table':
      return mapTable(node, source);

    default:
      // Nothing is ever dropped: a construct with no element type is kept
      // as the source it was written as, and re-emitted untouched
      return generateElement<UnsupportedElement>('unsupported', {
        value: sliceNode(node, source),
      });
  }
}

/**
 * Maps a GFM table, whose rows and cells are internal structure rather than
 * blocks of their own.
 *
 * @param node - The table node.
 * @param source - The document the node was parsed from.
 * @returns The table element.
 */
function mapTable(node: MdastNode, source: string): Element {
  return generateElement<TableElement>('table', {
    align: (node.align || []) as TableColumnAlignment[],
    children: (node.children || []).map((row) =>
      generateElement<TableRowElement>('table-row', {
        children: (row.children || []).map((cell) =>
          generateElement<TableCellElement>('table-cell', {
            children: parseInlineMarkdown(cell.children || [], source),
          }),
        ),
      }),
    ),
  });
}

/**
 * Returns which of the two heading syntaxes a heading was written with.
 *
 * @param node - The heading node.
 * @param source - The document the node was parsed from.
 * @returns The heading's syntax.
 */
function readHeadingSyntax(
  node: MdastNode,
  source: string,
): HeadingElement['syntax'] {
  // A setext heading is underlined rather than prefixed, so its source
  // spans more than one line
  if (!sliceNode(node, source).startsWith('#')) {
    return node.depth === 2 ? '-' : '=';
  }

  return '#';
}

/**
 * Returns how a code block was fenced, or that it was indented instead.
 *
 * @param node - The code node.
 * @param source - The document the node was parsed from.
 * @returns The code block's fence data.
 */
function readFence(
  node: MdastNode,
  source: string,
): Pick<CodeElement, 'fence' | 'fenceLength' | 'indented'> {
  const slice = sliceNode(node, source);
  const fence = slice[0];

  // An indented code block opens with its content rather than a fence
  if (fence !== '`' && fence !== '~') {
    return { indented: true };
  }

  let fenceLength = 0;

  while (slice[fenceLength] === fence) {
    fenceLength += 1;
  }

  return { fence, fenceLength };
}
