import { describe, it, expect } from 'vitest';
import { BlockElement } from '@minddrop/editor';
import { parseBlockElements } from './parseBlockElements';
import { MarkdownParseError } from '../errors';

const blockElement: BlockElement = {
  type: 'test',
  level: 'block',
  children: [{ text: '' }],
};

describe('parseBlockElements', () => {
  it('provides the current line on each itteration', () => {
    const markdown = 'Hello\nWorld';
    let parsedLines: string[] = [];

    parseBlockElements(markdown, [
      (line) => {
        parsedLines.push(line);

        return null;
      },
    ]);

    expect(parsedLines).toEqual(['Hello', 'World']);
  });

  it('consumes a single line', () => {
    const markdown = 'Hello\nWorld';

    const elements = parseBlockElements(markdown, [
      (line, consume) => {
        consume();

        return { ...blockElement, line };
      },
    ]);

    expect(elements).toEqual([
      { ...blockElement, line: 'Hello' },
      { ...blockElement, line: 'World' },
    ]);
  });

  it('consumes multiple lines', () => {
    const markdown = 'Hello\nWorld';

    const elements = parseBlockElements(markdown, [
      (line, consume) => {
        consume(2);

        return { ...blockElement, line };
      },
    ]);

    expect(elements).toEqual([{ ...blockElement, line: 'Hello' }]);
  });

  it('sequentially provides the next line', () => {
    const markdown = 'Line 1\nLine 2\nLine 3\nLine 4';
    let nextLines: (string | null)[] = [];

    parseBlockElements(markdown, [
      (line, consume, getNextLine) => {
        if (line === 'Line 1') {
          nextLines.push(getNextLine());
          nextLines.push(getNextLine());
          nextLines.push(getNextLine());
        }

        return null;
      },
    ]);

    expect(nextLines).toEqual(['Line 2', 'Line 3', 'Line 4']);
  });

  it('reset the next line index', () => {
    const markdown = 'Line 1\nLine 2\nLine 3\nLine 4';
    let nextLines: (string | null)[] = [];

    parseBlockElements(markdown, [
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
    ]);

    expect(nextLines).toEqual(['Line 3', 'Line 4']);
  });

  it('parses the line as a paragraph element if no parsers matched', () => {
    const markdown = 'Hello World';

    const elements = parseBlockElements(markdown, []);

    expect(elements).toEqual([
      {
        type: 'paragraph',
        level: 'block',
        children: [{ text: 'Hello World' }],
      },
    ]);
  });

  it('ignores empty lines', () => {
    const markdown = 'Hello\n\nWorld';

    const elements = parseBlockElements(markdown, [
      (line, consume) => {
        consume();

        return { ...blockElement, line };
      },
    ]);

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

    const elements = parseBlockElements(markdown, [
      (line, consume) => {
        if (line.startsWith('#')) {
          consume();

          return { ...blockElement, type: 'heading-1', line };
        }

        return null;
      },
      (line, consume, nextLine) => {
        if (line === '~~~') {
          let code: string[] = [];
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
    ]);

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
      parseBlockElements(markdown, [
        (line) => {
          return [blockElement];
        },
      ]);
    }).toThrow(MarkdownParseError);
  });

  it('throws an error if a parser consumes lines but does not return any elements', () => {
    const markdown = 'Line 1\nLine 2\nLine 3\nLine 4';

    expect(() => {
      parseBlockElements(markdown, [
        (line, consume) => {
          consume();

          return null;
        },
      ]);
    }).toThrow(MarkdownParseError);
  });
});
