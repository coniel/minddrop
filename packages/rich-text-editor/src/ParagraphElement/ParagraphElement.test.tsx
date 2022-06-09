import { ParagraphElementConfig } from './ParagraphElementConfig';

describe('ParagraphElement', () => {
  describe('initializeData', () => {
    it('creates a child text node from `text/plain` data', () => {
      // Call the initializeData callback with a data insert
      // containing plain text.
      const data = ParagraphElementConfig.initializeData({
        action: 'insert',
        types: ['text/plain'],
        data: { 'text/plain': 'Hello world' },
      });

      // Should create a child text node containing the plain text
      expect(data.children).toEqual([{ text: 'Hello world' }]);
    });

    it('trims whitespace from `text/plain` data', () => {
      // Call the initializeData callback with a data insert
      // containing plain text with whitespace around it.
      const data = ParagraphElementConfig.initializeData({
        action: 'insert',
        types: ['text/plain'],
        data: { 'text/plain': ' Hello world \n' },
      });

      // Should trim the whitespace
      expect(data.children).toEqual([{ text: 'Hello world' }]);
    });

    it('creates an empty child text node without `text/plain` data', () => {
      // Call the initializeData callback with a data insert
      // containing no plain text data.
      const data = ParagraphElementConfig.initializeData({
        action: 'insert',
        types: [],
        data: {},
      });

      // Should create an empty child text node
      expect(data.children).toEqual([{ text: '' }]);
    });
  });
});
