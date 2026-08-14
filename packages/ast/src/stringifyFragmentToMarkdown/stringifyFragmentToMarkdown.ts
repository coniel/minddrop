import { getElementTypeConfig } from '../ElementTypeConfigs';
import { Element, Fragment, TextElement } from '../types';

type MarkName = 'bold' | 'italic' | 'strikethrough' | 'code';

/**
 * The order marks are opened in, so that a run of leaves sharing marks
 * produces a stable spelling.
 */
const MarkOrder: MarkName[] = ['bold', 'italic', 'strikethrough', 'code'];

/**
 * The delimiter used when a leaf carries no recorded syntax, which is the
 * case for marks applied in the editor rather than parsed from a document.
 */
const DefaultMarkSyntax: Record<MarkName, string> = {
  bold: '**',
  italic: '*',
  strikethrough: '~~',
  code: '`',
};

interface OpenMark {
  /**
   * The mark the delimiter belongs to.
   */
  name: MarkName;

  /**
   * The delimiter that opened it, which is re-emitted to close it.
   */
  syntax: string;
}

/**
 * Stringifies an array of text and inline elements
 * into a markdown formatted string.
 *
 * @param fragment - The fragment to stringify.
 * @returns The stringified markdown fragment.
 */
export function stringifyFragmentToMarkdown(fragment: Fragment): string {
  let buffer = '';
  // Marks currently open, outermost first, so they can be closed in the
  // reverse of the order they were opened
  const openMarks: OpenMark[] = [];

  fragment.forEach((child) => {
    // Child is an inline element, which its config knows how to serialize
    if ('type' in child) {
      // Marks cannot span an inline element boundary
      buffer += closeMarksFrom(openMarks, 0);
      buffer += stringifyInlineElement(child as Element);

      return;
    }

    const leaf = child as TextElement;

    buffer += closeMarksFrom(openMarks, firstClosingMarkIndex(openMarks, leaf));
    buffer += openMarksFor(openMarks, leaf);
    buffer += leaf.text;
  });

  // Close anything still open at the end of the fragment
  return buffer + closeMarksFrom(openMarks, 0);
}

/**
 * Serializes an inline element using its element type config.
 *
 * @param element - The inline element.
 * @returns The element's markdown.
 */
function stringifyInlineElement(element: Element): string {
  const config = getElementTypeConfig(element.type);

  // An element with no config cannot be serialized, so fall back to its text
  // content rather than dropping it
  if (!config) {
    return stringifyFragmentToMarkdown(element.children);
  }

  return config.toMarkdown(element);
}

/**
 * Finds the outermost open mark which the given leaf no longer carries.
 * Everything from there up must close, since markdown delimiters nest.
 *
 * @param openMarks - The currently open marks.
 * @param leaf - The leaf being serialized.
 * @returns The index to close from, or the stack length if nothing closes.
 */
function firstClosingMarkIndex(
  openMarks: OpenMark[],
  leaf: TextElement,
): number {
  const index = openMarks.findIndex((mark) => !leaf[mark.name]);

  return index === -1 ? openMarks.length : index;
}

/**
 * Closes every open mark from the given index up, innermost first.
 *
 * @param openMarks - The currently open marks, modified in place.
 * @param index - The index to close from.
 * @returns The closing delimiters.
 */
function closeMarksFrom(openMarks: OpenMark[], index: number): string {
  let result = '';

  while (openMarks.length > index) {
    result += openMarks.pop()!.syntax;
  }

  return result;
}

/**
 * Opens every mark the leaf carries which is not already open.
 *
 * @param openMarks - The currently open marks, modified in place.
 * @param leaf - The leaf being serialized.
 * @returns The opening delimiters.
 */
function openMarksFor(openMarks: OpenMark[], leaf: TextElement): string {
  let result = '';

  MarkOrder.forEach((name) => {
    // Skip marks the leaf does not carry or which are already open
    if (!leaf[name] || openMarks.some((mark) => mark.name === name)) {
      return;
    }

    const syntax = resolveMarkSyntax(name, leaf);

    openMarks.push({ name, syntax });
    result += syntax;
  });

  return result;
}

/**
 * Returns the delimiter a leaf's mark was authored with, falling back to the
 * default spelling for marks applied in the editor.
 *
 * @param name - The mark.
 * @param leaf - The leaf being serialized.
 * @returns The delimiter.
 */
function resolveMarkSyntax(name: MarkName, leaf: TextElement): string {
  const syntax = leaf[`${name}Syntax`];

  if (typeof syntax === 'string' && syntax) {
    return syntax;
  }

  return DefaultMarkSyntax[name];
}
