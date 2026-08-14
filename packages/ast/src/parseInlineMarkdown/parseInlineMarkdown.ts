import {
  BreakElement,
  FootnoteReferenceElement,
  ImageElement,
  ImageReferenceElement,
  InlineHtmlElement,
  InlineMathElement,
  LinkElement,
  LinkReferenceElement,
  ReferenceType,
} from '../element-configs';
import {
  MdastNode,
  sliceNode,
  startOffset,
} from '../parseElementsFromMarkdown/mdast';
import { Element, Fragment, TextElement } from '../types';
import { generateElement } from '../utils';

/**
 * Maps a block's mdast inline content into text elements and inline
 * elements.
 *
 * Marks record the delimiter they were written with, so a leaf which the
 * user later edits still serializes back with the spelling they chose.
 *
 * @param nodes - The block's mdast children.
 * @param source - The document the nodes were parsed from.
 * @returns The block's inline content.
 */
export function parseInlineMarkdown(
  nodes: MdastNode[],
  source: string,
): Fragment {
  const fragment = mapNodes(nodes, source, {});

  // Slate requires every block to hold at least one text leaf
  if (!fragment.length) {
    return [{ text: '' }];
  }

  return fragment;
}

/**
 * Maps a run of inline nodes, carrying the marks their ancestors applied.
 *
 * @param nodes - The nodes to map.
 * @param source - The document the nodes were parsed from.
 * @param marks - The marks applied by enclosing nodes.
 * @returns The mapped inline content.
 */
function mapNodes(
  nodes: MdastNode[],
  source: string,
  marks: Partial<TextElement>,
): Fragment {
  return nodes.flatMap((node) => mapNode(node, source, marks));
}

/**
 * Maps a single inline node.
 *
 * @param node - The node to map.
 * @param source - The document the node was parsed from.
 * @param marks - The marks applied by enclosing nodes.
 * @returns The mapped inline content.
 */
function mapNode(
  node: MdastNode,
  source: string,
  marks: Partial<TextElement>,
): Fragment {
  const children = node.children || [];

  switch (node.type) {
    case 'text':
      return [{ ...marks, text: node.value || '' }];

    case 'strong':
      return mapNodes(children, source, {
        ...marks,
        bold: true,
        boldSyntax: source.slice(startOffset(node), startOffset(node) + 2),
      });

    case 'emphasis':
      return mapNodes(children, source, {
        ...marks,
        italic: true,
        italicSyntax: source.slice(startOffset(node), startOffset(node) + 1),
      });

    case 'delete':
      return mapNodes(children, source, {
        ...marks,
        strikethrough: true,
        strikethroughSyntax: readLeading(sliceNode(node, source), '~'),
      });

    case 'inlineCode':
      return [
        {
          ...marks,
          text: node.value || '',
          code: true,
          codeSyntax: readLeading(sliceNode(node, source), '`'),
        },
      ];

    case 'link':
      return [mapLink(node, source, marks)];

    case 'linkReference':
      return [
        generateElement<LinkReferenceElement>('link-reference', {
          identifier: node.identifier || '',
          label: node.label,
          referenceType: (node.referenceType || 'full') as ReferenceType,
          children: mapNodes(children, source, marks),
        }),
      ];

    case 'image':
      return [
        generateElement<ImageElement>('image', {
          url: node.url || '',
          alt: node.alt,
          title: node.title,
        }),
      ];

    case 'imageReference':
      return [
        generateElement<ImageReferenceElement>('image-reference', {
          identifier: node.identifier || '',
          label: node.label,
          alt: node.alt,
          referenceType: (node.referenceType || 'full') as ReferenceType,
        }),
      ];

    case 'break':
      return [
        generateElement<BreakElement>('break', {
          syntax: readBreakSyntax(sliceNode(node, source)),
        }),
      ];

    case 'footnoteReference':
      return [
        generateElement<FootnoteReferenceElement>('footnote-reference', {
          identifier: node.identifier || '',
          label: node.label,
        }),
      ];

    case 'inlineMath':
      return [
        generateElement<InlineMathElement>('inline-math', {
          value: node.value || '',
        }),
      ];

    case 'html':
      return [
        generateElement<InlineHtmlElement>('inline-html', {
          value: node.value || '',
        }),
      ];

    default:
      // An unmapped inline node still has to survive, so it is kept as the
      // text it was written as
      return [{ ...marks, text: sliceNode(node, source) }];
  }
}

/**
 * Maps a link, distinguishing an autolink from an inline link. Both parse
 * to the same node, so only the source tells them apart.
 *
 * @param node - The link node.
 * @param source - The document the node was parsed from.
 * @param marks - The marks applied by enclosing nodes.
 * @returns The link element.
 */
function mapLink(
  node: MdastNode,
  source: string,
  marks: Partial<TextElement>,
): Element {
  const autolink = sliceNode(node, source).startsWith('<');

  return generateElement<LinkElement>('link', {
    url: node.url || '',
    title: node.title,
    ...(autolink ? { autolink: true } : {}),
    children: mapNodes(node.children || [], source, marks),
  });
}

/**
 * Returns the run of a delimiter character a construct opens with, which
 * can be longer than one character.
 *
 * @param slice - The construct's source.
 * @param character - The delimiter character.
 * @returns The opening delimiter.
 */
function readLeading(slice: string, character: string): string {
  let length = 0;

  while (slice[length] === character) {
    length += 1;
  }

  return slice.slice(0, length) || character;
}

/**
 * Returns the spelling of a hard line break, which is either a backslash or
 * a run of trailing spaces.
 *
 * @param slice - The break's source.
 * @returns The break's syntax.
 */
function readBreakSyntax(slice: string): string {
  if (slice.startsWith('\\')) {
    return '\\';
  }

  // The slice runs to the start of the next line, so the spaces which made
  // the break are everything before the newline
  return slice.slice(0, slice.indexOf('\n'));
}
