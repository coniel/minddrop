import { describe, it, expect } from 'vitest';
import {
  splitMarkdownIntoBlocks,
  isHeading1or2,
  isHeading1Alt,
  isHeading2Alt,
  isHeading3,
  isImageOrFile,
  isBlockquote,
  isTable,
  isStandaloneLink,
  isCodeBlockStart,
  isMathBlockStart,
  extractImageOrFileData,
  extractStandaloneLinkData,
  extractCodeBlockLanguage,
} from './splitMarkdownIntoBlocks';

// Helper function tests
describe('isHeading1or2', () => {
  it('should return true for level 1 heading', () => {
    // Check for level 1 heading
    expect(isHeading1or2('# Heading 1')).toBe(true);
  });

  it('should return true for level 2 heading', () => {
    // Check for level 2 heading
    expect(isHeading1or2('## Heading 2')).toBe(true);
  });

  it('should return false for non-heading text', () => {
    // Check for non-heading text
    expect(isHeading1or2('Some text')).toBe(false);
  });
});

describe('isHeading1Alt', () => {
  it('should return true for level 1 heading with ===', () => {
    // Check for level 1 heading with ===
    expect(isHeading1Alt('Heading 1', '===')).toBe(true);
  });

  it('should return false for non-heading text', () => {
    // Check for non-heading text
    expect(isHeading1Alt('Some text', '')).toBe(false);
  });
});

describe('isHeading2Alt', () => {
  it('should return true for level 2 heading with ---', () => {
    // Check for level 2 heading with ---
    expect(isHeading2Alt('Heading 2', '---')).toBe(true);
  });

  it('should return false for non-heading text', () => {
    // Check for non-heading text
    expect(isHeading2Alt('Some text', '')).toBe(false);
  });
});

describe('isHeading3', () => {
  it('should return true for level 3 heading', () => {
    // Check for level 3 heading
    expect(isHeading3('### Heading 3')).toBe(true);
  });

  it('should return false for non-heading text', () => {
    // Check for non-heading text
    expect(isHeading3('Some text')).toBe(false);
  });
});

describe('isImageOrFile', () => {
  it('should return true for image', () => {
    // Check for image
    expect(
      isImageOrFile('![Image Alt Text](https://example.com/image.jpg)'),
    ).toBe(true);
  });

  it('should return true for file', () => {
    // Check for file
    expect(
      isImageOrFile('![File Alt Text](https://example.com/document.pdf)'),
    ).toBe(true);
  });

  it('should return false for non-image or file text', () => {
    // Check for non-image or file text
    expect(isImageOrFile('Some text')).toBe(false);
  });
});

describe('isBlockquote', () => {
  it('should return true for blockquote', () => {
    // Check for blockquote
    expect(isBlockquote('> This is a blockquote.')).toBe(true);
  });

  it('should return false for non-blockquote text', () => {
    // Check for non-blockquote text
    expect(isBlockquote('Some text')).toBe(false);
  });
});

describe('isTable', () => {
  it('should return true for table', () => {
    // Check for table
    expect(isTable('| Header 1 | Header 2 |')).toBe(true);
  });

  it('should return false for non-table text', () => {
    // Check for non-table text
    expect(isTable('Some text')).toBe(false);
  });
});

describe('isStandaloneLink', () => {
  it('should return true for standalone link', () => {
    // Check for standalone link
    expect(isStandaloneLink('[Link Title](https://example.com)')).toBe(true);
  });

  it('should return false for non-link text', () => {
    // Check for non-link text
    expect(isStandaloneLink('Some text')).toBe(false);
  });

  it('should return false for inline link', () => {
    // Check for inline link
    expect(
      isStandaloneLink('Text with a [Link Title](https://example.com) inline'),
    ).toBe(false);
  });
});

describe('isCodeBlockStart', () => {
  it('should return true for backtick fenced code block', () => {
    // Check for backtick fenced code block
    expect(isCodeBlockStart('```')).toBe(true);
  });

  it('should return true for tilde fenced code block', () => {
    // Check for tilde fenced code block
    expect(isCodeBlockStart('~~~')).toBe(true);
  });

  it('should return false for non-code block text', () => {
    // Check for non-code block text
    expect(isCodeBlockStart('Some text')).toBe(false);
  });
});

describe('isMathBlockStart', () => {
  it('should return true for math block start', () => {
    // Check for math block start
    expect(isMathBlockStart('$$')).toBe(true);
  });

  it('should return false for non-math block text', () => {
    // Check for non-math block text
    expect(isMathBlockStart('Some text')).toBe(false);
  });
});

describe('extractImageOrFileData', () => {
  it('should extract data from image', () => {
    // Check extraction of data from image
    const match = extractImageOrFileData(
      '![Image Alt Text](https://example.com/image.jpg)',
    );
    expect(match && match.slice(1)).toEqual([
      'Image Alt Text',
      'https://example.com/image.jpg',
      undefined,
    ]);
  });

  it('should extract data from file with tooltip', () => {
    // Check extraction of data from file with tooltip
    const match = extractImageOrFileData(
      '![File Alt Text](https://example.com/document.pdf "File Tooltip")',
    );
    expect(match && match.slice(1)).toEqual([
      'File Alt Text',
      'https://example.com/document.pdf',
      'File Tooltip',
    ]);
  });

  it('should return null for non-image or file text', () => {
    // Check extraction from non-image or file text
    expect(extractImageOrFileData('Some text')).toBeNull();
  });
});

describe('extractStandaloneLinkData', () => {
  it('should extract data from standalone link', () => {
    // Check extraction of data from standalone link
    const match = extractStandaloneLinkData(
      '[Link Title](https://example.com "Tooltip Title")',
    );
    expect(match && match.slice(1)).toEqual([
      'Link Title',
      'https://example.com',
      'Tooltip Title',
    ]);
  });

  it('should extract data from standalone link without tooltip', () => {
    // Check extraction of data from standalone link without tooltip
    const match = extractStandaloneLinkData(
      '[Link Title](https://example.com)',
    );
    expect(match && match.slice(1)).toEqual([
      'Link Title',
      'https://example.com',
      undefined,
    ]);
  });

  it('should return null for non-link text', () => {
    // Check extraction from non-link text
    expect(extractStandaloneLinkData('Some text')).toBeNull();
  });
});

describe('extractCodeBlockLanguage', () => {
  it('should extract language from backtick fenced code block', () => {
    // Check extraction of language from backtick fenced code block
    const match = extractCodeBlockLanguage('```javascript');
    expect(match && match.slice(1)).toEqual(['javascript', undefined]);
  });

  it('should extract language from tilde fenced code block', () => {
    // Check extraction of language from tilde fenced code block
    const match = extractCodeBlockLanguage('~~~javascript');
    expect(match && match.slice(1)).toEqual([undefined, 'javascript']);
  });

  it('should return array with undefined language for code block without language', () => {
    // Check extraction from code block without language
    const match1 = extractCodeBlockLanguage('```');
    expect(match1 && match1.slice(1)).toEqual([undefined, undefined]);
    const match2 = extractCodeBlockLanguage('~~~');
    expect(match2 && match2.slice(1)).toEqual([undefined, undefined]);
  });
});

describe('splitMarkdownIntoBlocks', () => {
  it('should split Markdown text into blocks', () => {
    const markdownText = `
# Heading 1

Some introductory text.

Heading 1 Alt
=============

## Heading 2

Some more text.

Heading 2 Alt
-------------

### Heading 3

Text under heading 3.

\`\`\`javascript
console.log('Hello, world!');
\`\`\`

~~~
console.log('Hello, tildes!');
~~~

$$
E = mc^2
$$

![Image Alt Text](https://example.com/image.jpg "Image Tooltip")
![File Alt Text](https://example.com/document.pdf "File Tooltip")

> This is a blockquote.

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |

[Link Title](https://example.com)

Some text before the link [Another Link Title](https://another-example.com "Tooltip Title")

[Standalone Link Title](https://example.com/standalone "Standalone Tooltip")
[Yet Another Standalone Link](https://example.com/another-standalone "Another Tooltip")

Some text after links.

Multiple paragraphs of text.

Separated by empty lines.

Even more text after multiple empty lines.

- List item 1
- List item 2
- List item 3
`;

    const blocks = splitMarkdownIntoBlocks(markdownText);

    expect(blocks).toEqual([
      // Check heading-1 block
      { type: 'heading-1', markdown: '# Heading 1', headingSyntax: '#' },
      // Check text block
      { type: 'text', markdown: 'Some introductory text.\n' },
      // Check heading-1 block with ===
      {
        type: 'heading-1',
        markdown: 'Heading 1 Alt\n=============',
        headingSyntax: '=',
      },
      // Check heading-2 block
      { type: 'heading-2', markdown: '## Heading 2', headingSyntax: '#' },
      // Check text block
      { type: 'text', markdown: 'Some more text.\n' },
      // Check heading-2 block with ---
      {
        type: 'heading-2',
        markdown: 'Heading 2 Alt\n-------------',
        headingSyntax: '-',
      },
      // Check heading-3 block
      { type: 'text', markdown: '### Heading 3\n\nText under heading 3.\n' },
      // Check code block with backticks
      {
        type: 'code',
        markdown: "```javascript\nconsole.log('Hello, world!');\n```",
        language: 'javascript',
        delimiter: '```',
        code: "console.log('Hello, world!');",
      },
      // Check code block with tildes
      {
        type: 'code',
        markdown: "~~~\nconsole.log('Hello, tildes!');\n~~~",
        delimiter: '~~~',
        code: "console.log('Hello, tildes!');",
        language: undefined,
      },
      // Check math block
      { type: 'math', markdown: '$$\nE = mc^2\n$$', expression: 'E = mc^2' },
      // Check image block
      {
        type: 'image',
        markdown:
          '![Image Alt Text](https://example.com/image.jpg "Image Tooltip")',
        url: 'https://example.com/image.jpg',
        title: 'Image Alt Text',
        description: 'Image Tooltip',
      },
      // Check file block
      {
        type: 'file',
        markdown:
          '![File Alt Text](https://example.com/document.pdf "File Tooltip")',
        url: 'https://example.com/document.pdf',
        title: 'File Alt Text',
        description: 'File Tooltip',
      },
      // Check blockquote block
      { type: 'blockquote', markdown: '> This is a blockquote.' },
      // Check table block
      {
        type: 'table',
        markdown:
          '| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |',
      },
      // Check standalone link block
      {
        type: 'link',
        markdown: '[Link Title](https://example.com)',
        url: 'https://example.com',
        title: 'Link Title',
        description: undefined,
      },
      // Check text block
      {
        type: 'text',
        markdown:
          'Some text before the link [Another Link Title](https://another-example.com "Tooltip Title")\n',
      },
      // Check standalone link block
      {
        type: 'link',
        markdown:
          '[Standalone Link Title](https://example.com/standalone "Standalone Tooltip")',
        url: 'https://example.com/standalone',
        title: 'Standalone Link Title',
        description: 'Standalone Tooltip',
      },
      // Check standalone link block
      {
        type: 'link',
        markdown:
          '[Yet Another Standalone Link](https://example.com/another-standalone "Another Tooltip")',
        url: 'https://example.com/another-standalone',
        title: 'Yet Another Standalone Link',
        description: 'Another Tooltip',
      },
      // Check text block
      {
        type: 'text',
        markdown:
          'Some text after links.\n\nMultiple paragraphs of text.\n\nSeparated by empty lines.\n\nEven more text after multiple empty lines.\n\n- List item 1\n- List item 2\n- List item 3\n',
      },
    ]);
  });
});
