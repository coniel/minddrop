import { describe, expect, it } from 'vitest';
import { ParseError } from '../errors';
import { generateElement } from '../utils';
import { parseElementsFromMarkdown } from './parseElementsFromMarkdown';

const blockElement = generateElement('test');

describe('parseElementsFromMarkdown', () => {
  it('returns an empty paragraph element if no elements were created', () => {
    const elements = parseElementsFromMarkdown([], '');

    expect(elements).toEqual([
      {
        ...blockElement,
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ]);
  });

  it('provides the current line on each itteration', () => {
    const markdown = 'Hello\nWorld';
    const parsedLines: string[] = [];

    parseElementsFromMarkdown(
      [
        (line) => {
          parsedLines.push(line);

          return null;
        },
      ],
      markdown,
    );

    expect(parsedLines).toEqual(['Hello', 'World']);
  });

  it('consumes a single line', () => {
    const markdown = 'Hello\nWorld';

    const elements = parseElementsFromMarkdown(
      [
        (line, consume) => {
          consume();

          return { ...blockElement, line };
        },
      ],
      markdown,
    );

    expect(elements).toEqual([
      { ...blockElement, line: 'Hello' },
      { ...blockElement, line: 'World' },
    ]);
  });

  it('consumes multiple lines', () => {
    const markdown = 'Hello\nWorld';

    const elements = parseElementsFromMarkdown(
      [
        (line, consume) => {
          consume(2);

          return { ...blockElement, line };
        },
      ],
      markdown,
    );

    expect(elements).toEqual([{ ...blockElement, line: 'Hello' }]);
  });

  it('sequentially provides the next line', () => {
    const markdown = 'Line 1\nLine 2\nLine 3\nLine 4';
    const nextLines: (string | null)[] = [];

    parseElementsFromMarkdown(
      [
        (line, consume, getNextLine) => {
          if (line === 'Line 1') {
            nextLines.push(getNextLine());
            nextLines.push(getNextLine());
            nextLines.push(getNextLine());
          }

          return null;
        },
      ],
      markdown,
    );

    expect(nextLines).toEqual(['Line 2', 'Line 3', 'Line 4']);
  });

  it('reset the next line index', () => {
    const markdown = 'Line 1\nLine 2\nLine 3\nLine 4';
    const nextLines: (string | null)[] = [];

    parseElementsFromMarkdown(
      [
        (line, consume, getNextLine) => {
          if (line === 'Line 1') {
            getNextLine();
            getNextLine();
            getNextLine();
          }

          if (line === 'Line 2') {
            nextLines.push(getNextLine());
            nextLines.push(getNextLine());
          }

          return null;
        },
      ],
      markdown,
    );

    expect(nextLines).toEqual(['Line 3', 'Line 4']);
  });

  it('parses the line as a paragraph element if no parsers matched', () => {
    const markdown = 'Hello World';

    const elements = parseElementsFromMarkdown([], markdown);

    expect(elements).toEqual([
      {
        ...blockElement,
        type: 'paragraph',
        children: [{ text: 'Hello World' }],
      },
    ]);
  });

  it('ignores empty lines', () => {
    const markdown = 'Hello\n\nWorld';

    const elements = parseElementsFromMarkdown(
      [
        (line, consume) => {
          consume();

          return { ...blockElement, line };
        },
      ],
      markdown,
    );

    expect(elements).toEqual([
      { ...blockElement, line: 'Hello' },
      { ...blockElement, line: 'World' },
    ]);
  });

  it('supports multiple parsers', () => {
    const markdown = `# Heading 1

Heading 2
---------

Paragraph

~~~
const foo = 'bar';

alert(foo);
~~~`;

    const elements = parseElementsFromMarkdown(
      [
        (line, consume) => {
          if (line.startsWith('#')) {
            consume();

            return { ...blockElement, type: 'heading-1', line };
          }

          return null;
        },
        (line, consume, nextLine) => {
          if (line === '~~~') {
            const code: string[] = [];
            let next = nextLine();

            while (next !== null && next !== '~~~') {
              code.push(next);
              next = nextLine();
            }

            if (next === '~~~') {
              consume(code.length + 2);

              return { ...blockElement, type: 'code', code: code.join('\n') };
            }
          }

          return null;
        },
        (line, consume, nextLine) => {
          const next = nextLine();

          if (next && next.match(/^-+$/)) {
            consume(2);

            return { ...blockElement, type: 'heading-2', line };
          }

          return null;
        },
      ],
      markdown,
    );

    expect(elements).toEqual([
      {
        ...blockElement,
        type: 'heading-1',
        line: '# Heading 1',
      },
      { ...blockElement, type: 'heading-2', line: 'Heading 2' },
      {
        ...blockElement,
        type: 'paragraph',
        children: [{ text: 'Paragraph' }],
      },
      {
        ...blockElement,
        type: 'code',
        code: "const foo = 'bar';\n\nalert(foo);",
      },
    ]);
  });

  it('throws an error if a parser does not consume any lines', () => {
    const markdown = 'Line 1\nLine 2\nLine 3\nLine 4';

    expect(() => {
      parseElementsFromMarkdown(
        [
          () => {
            return [blockElement];
          },
        ],
        markdown,
      );
    }).toThrow(ParseError);
  });

  it('throws an error if a parser consumes lines but does not return any elements', () => {
    const markdown = 'Line 1\nLine 2\nLine 3\nLine 4';

    expect(() => {
      parseElementsFromMarkdown(
        [
          (line, consume) => {
            consume();

            return null;
          },
        ],
        markdown,
      );
    }).toThrow(ParseError);
  });
});
