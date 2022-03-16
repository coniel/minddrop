import { DataInsert } from '@minddrop/core';
import { core } from '../test-utils';
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
  it('returns an empty text drop without data insert', () => {
    const data = createTextDrop(core);

    // Should return a document with a single empty paragraph
    expect(data.content).toEqual(
      JSON.stringify([{ type: 'paragraph', children: [{ text: '' }] }]),
    );
  });

  it('creates a text drop using plain text data', () => {
    const data = createTextDrop(core, textData);

    // Should return a document containing the inserted text
    expect(data.content).toEqual(
      JSON.stringify([
        { type: 'paragraph', children: [{ text: 'Hello world' }] },
      ]),
    );
  });
});
