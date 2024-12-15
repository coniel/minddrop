import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateElement } from '../../utils';
import { HeadingElement } from './HeadingElement.types';
import { parseHeadingElementFromMarkdown } from './parseHeadingElementFromMarkdown';

const headingElement = generateElement<HeadingElement>('heading', {
  level: 1,
  syntax: '#',
  children: [{ text: 'Heading' }],
});

const consume = vi.fn();
const nextLine = vi.fn();

describe('parseHeadingElementFromMarkdown', () => {
  afterEach(() => {
    consume.mockClear();
  });

  it('matches heading from level 1 to 6', () => {
    [...Array(6).keys()].forEach((index) => {
      const level = index + 1;
      const line = `${'#'.repeat(level)} Heading`;

      expect(parseHeadingElementFromMarkdown(line, consume, nextLine)).toEqual({
        ...headingElement,
        level,
      });
    });
  });

  it('returns null if line does not match heading', () => {
    const line = 'Not a heading';

    const element = parseHeadingElementFromMarkdown(line, consume, nextLine);

    expect(element).toBeNull();
  });

  it('consumes line', () => {
    const line = '# Heading';

    parseHeadingElementFromMarkdown(line, consume, nextLine);

    expect(consume).toHaveBeenCalledTimes(1);
  });

  it('extracts heading text', () => {
    const line = '# Heading text';
    const element = parseHeadingElementFromMarkdown(
      line,
      consume,
      nextLine,
    ) as HeadingElement;

    expect(element.children).toEqual([{ text: 'Heading text' }]);
  });

  describe('alternative heading syntax', () => {
    it('matches alternative heading 1 syntax', () => {
      nextLine.mockReturnValueOnce('=======');
      const line = 'Heading';

      const element = parseHeadingElementFromMarkdown(line, consume, nextLine);

      expect(element).toEqual({
        ...headingElement,
        level: 1,
        syntax: '=',
      });
    });

    it('matches alternative heading 2 syntax', () => {
      nextLine.mockReturnValueOnce('-------');
      const line = 'Heading';

      const element = parseHeadingElementFromMarkdown(line, consume, nextLine);

      expect(element).toEqual({
        ...headingElement,
        level: 2,
        syntax: '-',
      });
    });

    it('extracts heading text', () => {
      nextLine.mockReturnValueOnce('=======');
      const line = 'Heading text';

      const element = parseHeadingElementFromMarkdown(
        line,
        consume,
        nextLine,
      ) as HeadingElement;

      expect(element.children).toEqual([{ text: 'Heading text' }]);
    });

    it('consumes 2 lines', () => {
      nextLine.mockReturnValueOnce('=======');
      const line = 'Heading';

      parseHeadingElementFromMarkdown(line, consume, nextLine);

      expect(consume).toHaveBeenCalledWith(2);
    });
  });
});
