import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateElement } from '../../utils';
import { FileElement } from './FileElement.types';
import { parseFileElementFromMarkdown } from './parseFileElementFromMarkdown';

const consume = vi.fn();
const getNextLine = vi.fn();

const fileElement = generateElement<FileElement>('file', {
  filename: 'file.pdf',
  title: 'Some PDF',
  extension: 'pdf',
  description: 'Description',
});

describe('parseFileElementFromMarkdown', () => {
  afterEach(() => {
    consume.mockReset();
  });

  it('matches embedded files', () => {
    const line = '![Some PDF](file.pdf "Description")';

    const element = parseFileElementFromMarkdown(line, consume, getNextLine);

    expect(element).toEqual(fileElement);
  });

  it('matches embedded files without description', () => {
    const line = '![Some PDF](file.pdf)';

    const element = parseFileElementFromMarkdown(line, consume, getNextLine);

    expect(element).toEqual({
      ...fileElement,
      description: '',
    });
  });

  it('uses filename as title if title is not provided', () => {
    const line = '![](file.pdf)';

    const element = parseFileElementFromMarkdown(line, consume, getNextLine);

    expect(element).toEqual({
      ...fileElement,
      description: '',
      title: 'file.pdf',
    });
  });

  it('does not match if filename is not provided', () => {
    const line = '![Some PDF]()';

    const element = parseFileElementFromMarkdown(line, consume, getNextLine);

    expect(element).toBeNull();
  });

  it('does not match if there is text before the embedded file', () => {
    const line = 'Some text ![Some PDF](file.pdf)';

    const element = parseFileElementFromMarkdown(line, consume, getNextLine);

    expect(element).toBeNull();
  });

  it('does not match if there is text after the embedded file', () => {
    const line = '![Some PDF](file.pdf) Some text';

    const element = parseFileElementFromMarkdown(line, consume, getNextLine);

    expect(element).toBeNull();
  });

  it('does not match if the line is not an embedded file', () => {
    const line = '[Some PDF](file.pdf)';
    const element = parseFileElementFromMarkdown(line, consume, getNextLine);
    expect(element).toBeNull();
  });

  it('consumes the line', () => {
    const line = '![Some PDF](file.pdf "Description")';

    parseFileElementFromMarkdown(line, consume, getNextLine);

    expect(consume).toHaveBeenCalledOnce();
  });
});
