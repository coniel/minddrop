import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createDataTransfer } from '@minddrop/utils';
import {
  cleanup,
  rootStorageDatabase,
  setup,
  urlDatabase,
} from '../test-utils';
import { handleDataTransfer } from './handleDataTransfer';

describe('handleDataTransfer', () => {
  beforeEach(() => setup({ loadDatabaseEntries: false }));

  afterEach(cleanup);

  it('creates entries from files', async () => {
    const event = {
      dataTransfer: createDataTransfer({}, [
        new File(['file content'], 'dropped-image.png', { type: 'image/png' }),
      ]),
    } as DragEvent;

    const entries = await handleDataTransfer(rootStorageDatabase.id, event);

    expect(entries).toHaveLength(1);
  });

  it('creates entries from URLs', async () => {
    const event = {
      dataTransfer: createDataTransfer({
        'text/uri-list': 'https://example.com',
      }),
    } as DragEvent;

    const entries = await handleDataTransfer(urlDatabase.id, event);

    expect(entries).toHaveLength(1);
  });
});
