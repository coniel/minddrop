import { DataInsert, initializeCore } from '@minddrop/core';
import { DropTypeNotRegisteredError } from '../errors';
import { cleanup, initialize } from '../tests';
import { createOfType } from './createOfType';

const core = initializeCore({ appId: 'app', extensionId: 'drops' });

const data: DataInsert = {
  types: ['text/plain'],
  data: {
    'text/plain': 'Hello world',
  },
  files: [],
};

describe('createOfType', () => {
  beforeAll(() => {
    initialize();
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
});
