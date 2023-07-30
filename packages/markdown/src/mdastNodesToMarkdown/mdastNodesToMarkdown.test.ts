import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { RootContent } from '../types';
import { mdastNodesToMarkdown } from './mdastNodesToMarkdown';

const markdown = `# Title

Text

- List item
- List item
- List item

$$
E=mc^2
$$

---

| a | b  |  c |  d  |
| - | :- | -: | :-: |

![Image](img.png "Title")

\`\`\`js
console.log('foo');
\`\`\`
`;

const mdast = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .parse(markdown).children as RootContent[];

describe('mdastNodesToMarkdown', () => {
  it('converts MD AST to markdown', () => {
    expect(mdastNodesToMarkdown(mdast)).toBe(markdown);
  });
});
