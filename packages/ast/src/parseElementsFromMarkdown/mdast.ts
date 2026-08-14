import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

/**
 * The markdown dialect entry content is written in: CommonMark plus GFM,
 * plus math, which the app renders.
 */
const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMath);

/**
 * A parsed mdast node. The mdast types are structural rather than nominal,
 * and the mapping reads a handful of fields off many node types, so nodes
 * are read through one permissive shape rather than narrowed per type.
 */
export interface MdastNode {
  type: string;
  children?: MdastNode[];
  position?: {
    start: { offset: number };
    end: { offset: number };
  };
  value?: string;
  depth?: number;
  lang?: string | null;
  meta?: string | null;
  url?: string;
  title?: string | null;
  alt?: string | null;
  identifier?: string;
  label?: string;
  referenceType?: 'full' | 'collapsed' | 'shortcut';
  ordered?: boolean;
  start?: number | null;
  spread?: boolean;
  checked?: boolean | null;
  align?: (string | null)[];
}

/**
 * Parses markdown into an mdast tree.
 *
 * @param markdown - The markdown to parse.
 * @returns The tree's top level nodes.
 */
export function parseMdast(markdown: string): MdastNode[] {
  const root = processor.parse(markdown) as unknown as MdastNode;

  return root.children || [];
}

/**
 * Returns the source a node was parsed from.
 *
 * @param node - The node.
 * @param source - The document the node was parsed from.
 * @returns The node's source.
 */
export function sliceNode(node: MdastNode, source: string): string {
  return source.slice(startOffset(node), endOffset(node));
}

/**
 * Returns the offset a node's source starts at.
 *
 * @param node - The node.
 * @returns The start offset.
 */
export function startOffset(node: MdastNode): number {
  return node.position?.start.offset ?? 0;
}

/**
 * Returns the offset a node's source ends at.
 *
 * @param node - The node.
 * @returns The end offset.
 */
export function endOffset(node: MdastNode): number {
  return node.position?.end.offset ?? 0;
}

/**
 * Returns the offset the line containing the given offset begins at, which
 * is where a block's line prefix starts.
 *
 * @param source - The document.
 * @param offset - An offset into the document.
 * @returns The offset the line starts at.
 */
export function lineStartOffset(source: string, offset: number): number {
  return source.lastIndexOf('\n', offset - 1) + 1;
}
