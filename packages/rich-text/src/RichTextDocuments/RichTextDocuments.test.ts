import {
  cleanup,
  richTextDocument1,
  richTextDocument1PlainText,
  setup,
} from '../test-utils';
import { RichTextDocuments } from './RichTextDocuments';

describe('RichTextDocuments API', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('toPlainText', () => {
    it('converts a document to plain text', () => {
      // Convert a document to plain text
      const plainText = RichTextDocuments.toPlainText(richTextDocument1);

      // Should return the document's plain text
      expect(plainText).toBe(richTextDocument1PlainText);
    });
  });
});
