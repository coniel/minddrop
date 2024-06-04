import { describe, afterEach, it, expect, vi } from 'vitest';
import { FileElement, ImageElement } from '@minddrop/editor';
import { parseEmbeddedFile } from './parseEmbeddedFile';

const consume = vi.fn();
const getNextLine = vi.fn();

const fileElement: FileElement = {
  type: 'file',
  level: 'block',
  filename: 'file.pdf',
  title: 'Some PDF',
  extension: 'pdf',
  description: 'Description',
  children: [{ text: '' }],
};

const imageElement: ImageElement = {
  type: 'image',
  level: 'block',
  filename: 'image.jpg',
  title: 'Some image',
  description: 'Description',
  extension: 'jpg',
  children: [{ text: '' }],
};

describe('parseEmbeddedFile', () => {
  afterEach(() => {
    consume.mockReset();
  });

  it('matches embedded files', () => {
    const line = '![Some PDF](file.pdf "Description")';

    const element = parseEmbeddedFile(line, consume, getNextLine);

    expect(element).toEqual(fileElement);
  });

  it('matches embedded images', () => {
    const line = '![Some image](image.jpg "Description")';

    const element = parseEmbeddedFile(line, consume, getNextLine);

    expect(element).toEqual(imageElement);
  });

  it('matches embedded files without description', () => {
    const line = '![Some PDF](file.pdf)';

    const element = parseEmbeddedFile(line, consume, getNextLine);

    expect(element).toEqual({
      ...fileElement,
      description: '',
    });
  });

  it('uses filename as title if title is not provided', () => {
    const line = '![](file.pdf)';

    const element = parseEmbeddedFile(line, consume, getNextLine);

    expect(element).toEqual({
      ...fileElement,
      description: '',
      title: 'file.pdf',
    });
  });

  it('does not match if filename is not provided', () => {
    const line = '![Some PDF]()';

    const element = parseEmbeddedFile(line, consume, getNextLine);

    expect(element).toBeNull();
  });

  it('does not match if there is text before the embedded file', () => {
    const line = 'Some text ![Some PDF](file.pdf)';

    const element = parseEmbeddedFile(line, consume, getNextLine);

    expect(element).toBeNull();
  });

  it('does not match if there is text after the embedded file', () => {
    const line = '![Some PDF](file.pdf) Some text';

    const element = parseEmbeddedFile(line, consume, getNextLine);

    expect(element).toBeNull();
  });

  it('does not match if the line is not an embedded file', () => {
    const line = '[Some PDF](file.pdf)';
    const element = parseEmbeddedFile(line, consume, getNextLine);
    expect(element).toBeNull();
  });

  it('consumes the line', () => {
    const line = '![Some PDF](file.pdf "Description")';

    parseEmbeddedFile(line, consume, getNextLine);

    expect(consume).toHaveBeenCalledOnce();
  });
});
