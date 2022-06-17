import { DataInsert } from '@minddrop/core';
import { core } from '../test-utils';
import { initializeBookmarkDropData } from './initializeBookmarkDropData';

const urlDataInsert: DataInsert = {
  action: 'insert',
  types: ['text/plain', 'text/url'],
  data: {
    'text/plain': 'https://minddrop.app',
    'text/url': 'https://minddrop.app',
  },
  files: [],
};

const nonUrlDataInsert: DataInsert = {
  action: 'insert',
  types: ['text/plain'],
  data: {
    'text/plain': 'MindDrop',
  },
  files: [],
};

describe('initializeBookmarkDropData', () => {
  describe('without data insert', () => {
    it('initializes with an empty URL', () => {
      // Initialize a bookmark drop's data without a data insert
      const data = initializeBookmarkDropData(core);

      // Should contain an empty URL
      expect(data.url).toBe('');
      // Should have 'hasPreview' set to false
      expect(data.hasPreview).toBe(false);
    });
  });

  describe('with URL data insert', () => {
    it('initializes with the URL set', () => {
      // Initialize a bookmark drop's data with a data insert
      // containing a URL.
      const data = initializeBookmarkDropData(core, urlDataInsert);

      // Should contain the URL
      expect(data.url).toBe('https://minddrop.app');
      // Should have 'hasPreview' set to false
      expect(data.hasPreview).toBe(false);
    });
  });

  describe('with non URL data insert', () => {
    it('initializes with an empty URL', () => {
      // Initialize a bookmark drop's data with a data insert
      // which does not contain a URL.
      const data = initializeBookmarkDropData(core, nonUrlDataInsert);

      // Should contain an empty URL
      expect(data.url).toBe('');
      // Should have 'hasPreview' set to false
      expect(data.hasPreview).toBe(false);
    });
  });
});
