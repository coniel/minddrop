import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { getBlock } from '../getBlock';
import { cleanup, setup } from '../test-utils';
import { createBlock } from './createBlock';

describe('createBlock', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the new block', () => {
    const block = createBlock('text', { text: 'Hello, world!' });

    expect(block).toEqual({
      type: 'text',
      id: expect.any(String),
      created: expect.any(Date),
      lastModified: expect.any(Date),
      text: 'Hello, world!',
    });
  });

  it('adds the block to the store', () => {
    const block = createBlock('text', { text: 'Hello, world!' });

    expect(getBlock(block.id)).toEqual(block);
  });

  it('dispatches a block create event', async () =>
    new Promise<void>((done) => {
      Events.addListener('blocks:block:create', 'test', (payload) => {
        // Payload data should be the block
        expect(payload.data).toEqual({
          type: 'text',
          id: expect.any(String),
          created: expect.any(Date),
          lastModified: expect.any(Date),
          text: 'Hello, world!',
        });
        done();
      });

      // Create a block
      createBlock('text', { text: 'Hello, world!' });
    }));
});
