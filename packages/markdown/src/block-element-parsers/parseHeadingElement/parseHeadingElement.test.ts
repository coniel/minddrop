import { describe, it, expect, vi, afterEach } from 'vitest';
import { parseHeadingElement } from './parseHeadingElement';
import { BlockElement } from '@minddrop/editor';

const headingElement: BlockElement = {
  type: 'heading',
  level: 'block',
  children: [{ text: 'Heading' }],
};

const consume = vi.fn();
const nextLine = vi.fn();

describe('parseHeadingElement', () => {
  afterEach(() => {
    consume.mockClear();
  });

  it('matches heading from level 1 to 6', () => {
    [...Array(6).keys()].forEach((level) => {
      const line = `${'#'.repeat(level + 1)} Heading`;

      expect(parseHeadingElement(line, consume, nextLine)).toEqual({
        ...headingElement,
        type: `heading-${level + 1}`,
      });
    });
  });

  it('returns null if line does not match heading', () => {
    const line = 'Not a heading';

    const element = parseHeadingElement(line, consume, nextLine);

    expect(element).toBeNull();
  });

  it('consumes line', () => {
    const line = '# Heading';

    parseHeadingElement(line, consume, nextLine);

    expect(consume).toHaveBeenCalledTimes(1);
  });

  it('extracts heading text', () => {
    const line = '# Heading text';
    const element = parseHeadingElement(
      line,
      consume,
      nextLine,
    ) as BlockElement;

    expect(element.children).toEqual([{ text: 'Heading text' }]);
  });

  describe('alternative heading syntax', () => {
    it('matches alternative heading 1 syntax', () => {
      nextLine.mockReturnValueOnce('=======');
      const line = 'Heading';

      const element = parseHeadingElement(line, consume, nextLine);

      expect(element).toEqual({
        ...headingElement,
        type: 'heading-1',
      });
    });

    it('matches alternative heading 2 syntax', () => {
      nextLine.mockReturnValueOnce('-------');
      const line = 'Heading text';

      const element = parseHeadingElement(line, consume, nextLine);

      expect(element).toEqual({
        ...headingElement,
        type: 'heading-2',
        children: [{ text: 'Heading text' }],
      });
    });

    it('extracts heading text', () => {
      nextLine.mockReturnValueOnce('=======');
      const line = 'Heading text';

      const element = parseHeadingElement(
        line,
        consume,
        nextLine,
      ) as BlockElement;

      expect(element.children).toEqual([{ text: 'Heading text' }]);
    });

    it('consumes 2 lines', () => {
      nextLine.mockReturnValueOnce('=======');
      const line = 'Heading';

      parseHeadingElement(line, consume, nextLine);

      expect(consume).toHaveBeenCalledWith(2);
    });
  });
});
