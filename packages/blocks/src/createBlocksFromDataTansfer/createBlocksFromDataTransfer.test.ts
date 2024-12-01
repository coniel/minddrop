import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import {
  TestTextBlock,
  cleanup,
  textBlockClassifier,
  textBlockConfig,
} from '../test-utils';
import { createDataTransfer } from '@minddrop/test-utils';
import { createBlocksFromDataTransfer } from './createBlocksFromDataTransfer';
import { registerTextBlockClassifier } from '../BlockClassifiersStore';
import { getBlock } from '../getBlock';
import { registerBlockType } from '../BlockTypesStore';
import { Events } from '@minddrop/events';

const dataTransfer = createDataTransfer({ 'text/plain': 'Hello, World!' });

describe('createBlocksFromDataTransfer', () => {
  beforeAll(() => {
    registerTextBlockClassifier(textBlockClassifier);
    registerBlockType(textBlockConfig);
  });

  afterEach(() => {
    cleanup();
  });

  it('creates the blocks', async () => {
    const blocks = await createBlocksFromDataTransfer(
      dataTransfer,
      '/path/to/parent',
    );

    expect(getBlock(blocks[0].id)).toEqual(blocks[0]);
  });

  it('calls the block type onCreate function', async () => {
    vi.useFakeTimers();

    const blocks = await createBlocksFromDataTransfer(
      dataTransfer,
      '/path/to/parent',
    );

    // The onCreate function for the text block type sets the
    // `bar` property to 'bar' after 1 second.
    vi.advanceTimersByTime(1000);

    const block = getBlock(blocks[0].id) as TestTextBlock;

    expect(block.bar).toBe('bar');

    vi.useRealTimers();
  });

  it('dispatches a block create event for each individual block', async () =>
    new Promise<void>(async (done) => {
      Events.addListener('blocks:block:create', 'test', (payload) => {
        // Payload data should be the new block
        expect(payload.data).toEqual({
          id: expect.any(String),
          created: expect.any(Date),
          lastModified: expect.any(Date),
          type: textBlockConfig.id,
          variant: textBlockConfig.defaultVariant,
          ...textBlockConfig.initialProperties,
          text: 'Hello, World!',
        });

        done();
      });

      createBlocksFromDataTransfer(dataTransfer, '/path/to/parent');
    }));
});
