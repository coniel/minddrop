import { describe, it, expect } from 'vitest';
import { generateVoidBlockElement } from '../../utils';
import { stringifyFileElementToMarkdown } from './stringifyFileElementToMarkdown';
import { FileElement } from './FileElement.types';

const fileElement = generateVoidBlockElement<FileElement>('file', {
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
