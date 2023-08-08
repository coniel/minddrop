import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';

/**
 * Parses HTML into markdown.
 *
 * @param html - The HTML to parse.
 * @returns The parsed markdown.
 */
export function htmlToMarkdown(html: string): string {
  const file = unified()
    .use(rehypeParse)
    .use(rehypeRemark)
    .use(remarkStringify)
    .processSync(html);

  return file.toString();
}
