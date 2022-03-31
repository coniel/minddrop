import { mapById } from '@minddrop/utils';
import {
  cleanup,
  richTextDocument1,
  richTextDocument1PlainText,
  richTextDocument2,
  setup,
} from '../test-utils';
import { RichTextDocuments } from './RichTextDocuments';

describe('RichTextDocuments API', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('get', () => {
    it('returns a single document when passed a string ID', () => {
      // Get a single document
      const result = RichTextDocuments.get(richTextDocument1.id);

      // Should return the document
      expect(result).toEqual(richTextDocument1);
    });

    it('returns an document map when passed an array of IDs', () => {
      // Get a multiple documents
      const result = RichTextDocuments.get([
        richTextDocument1.id,
        richTextDocument2.id,
      ]);

      // Should return the documents as a map
      expect(result).toEqual(mapById([richTextDocument1, richTextDocument2]));
    });
  });

  describe('toPlainText', () => {
    it('converts a document to plain text', () => {
      // Convert a document to plain text
      const plainText = RichTextDocuments.toPlainText(richTextDocument1);

      // Should return the document's plain text
      expect(plainText).toBe(richTextDocument1PlainText);
    });
  });
});
