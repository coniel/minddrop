import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { FileElement } from './FileElement.types';
import { stringifyFileElementToMarkdown } from './stringifyFileElementToMarkdown';

const fileElement = generateElement<FileElement>('file', {
  filename: 'Some file.pdf',
  title: 'My file',
  extension: 'pdf',
  description: 'Example description',
});

describe('stringifyFileElementToMarkdown', () => {
  it('stringifies the file', () => {
    expect(stringifyFileElementToMarkdown(fileElement)).toBe(
      `![${fileElement.title}](${fileElement.filename} "${fileElement.description}")`,
    );
  });

  it('stringifies the file without a description', () => {
    const element = { ...fileElement, description: undefined };
    expect(stringifyFileElementToMarkdown(element)).toBe(
      `![${element.title}](${element.filename})`,
    );
  });
});
