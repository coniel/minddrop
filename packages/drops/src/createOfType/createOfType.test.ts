import { DataInsert, initializeCore } from '@minddrop/core';
import { DropTypeNotRegisteredError } from '../errors';
import { cleanup, setup } from '../test-utils';
import { getDrop } from '../getDrop';
import { createOfType } from './createOfType';

const core = initializeCore({ appId: 'app', extensionId: 'drops' });

const data: DataInsert = {
  action: 'insert',
  types: ['text/plain'],
  data: {
    'text/plain': 'Hello world',
  },
  files: [],
};

describe('createOfType', () => {
  beforeAll(() => {
    setup();
  });

  afterAll(() => {
    cleanup();
  });

  it('throws a DropTypeNotRegisteredError if the drop type is not registered', async () => {
    await expect(() => createOfType(core, 'unregistered')).rejects.toThrowError(
      DropTypeNotRegisteredError,
    );
  });

  it('returns the new drop', async () => {
    const drop = await createOfType(core, 'text', data);

    expect(drop).toBeDefined();
    expect(drop.type).toBe('text');
  });

  it('saves the new drop', async () => {
    const drop = await createOfType(core, 'text', data);

    // Get the created drop
    const saved = getDrop(drop.id);

    // Should match returned drop
    expect(saved).toEqual(drop);
  });
});
