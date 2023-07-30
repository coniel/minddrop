import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { RootContent } from 'mdast';

/**
 * Parses markdown into markdown abstract syntax tree nodes.
 *
 * @param markdown - The markdown to parse.
 * @returns MD AST nodes.
 */
export function parseMarkdown(markdown: string): RootContent[] {
  return unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkMath)
    .parse(markdown).children as RootContent[];
}
