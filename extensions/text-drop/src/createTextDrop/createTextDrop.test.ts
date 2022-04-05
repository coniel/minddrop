import { DataInsert } from '@minddrop/core';
import {
  RichTextDocument,
  RichTextDocuments,
  RichTextElements,
} from '@minddrop/rich-text';
import { cleanup, core, setup } from '../test-utils';
import { createTextDrop } from './createTextDrop';

const textData: DataInsert = {
  action: 'insert',
  types: ['text/plain', 'text/html'],
  data: {
    'text/plain': 'Hello world',
    'text/html': '<p>Hello world</p>',
  },
  files: [],
};

describe('createTextDrop', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('without data insert', () => {
    it('returns a drop containing an empty heading and paragraph', () => {
      const data = createTextDrop(core);

      // Get the drop document
      const document = RichTextDocuments.get(
        data.richTextDocument,
      ) as RichTextDocument;

      // Get the document's child elements
      const elements = RichTextElements.get(document.children);

      // Document should have 2 children
      expect(document.children.length).toBe(2);
      // First child should be a 'heading-1' element
      expect(elements[document.children[0]].type).toBe('heading-1');
      // Second child should be a 'paragraph' element
      expect(elements[document.children[1]].type).toBe('paragraph');
    });
  });

  describe('with plain text data insert', () => {
    it('returns a drop containing a paragraph with the plain text', () => {
      const data = createTextDrop(core, textData);

      // Get the drop document
      const document = RichTextDocuments.get(
        data.richTextDocument,
      ) as RichTextDocument;

      // Get the document's child elements
      const elements = RichTextElements.get(document.children);

      // Document should have 1 child
      expect(document.children.length).toBe(1);
      // Child should be a 'paragraph' element
      expect(elements[document.children[0]].type).toBe('paragraph');
      // Paragraph should contain the plain text
      expect(elements[document.children[0]].children).toEqual([
        { text: textData.data['text/plain'] },
      ]);
    });
  });
});
