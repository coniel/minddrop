import { initializeCore } from '@minddrop/core';
import { generateDrop } from '../generateDrop';
import { DropConfig } from '../types';
import { useDropsStore } from '../useDropsStore';
import { registerDropType } from '../registerDropType';
import { unregisterDropType } from './unregisterDropType';
import { DropTypeNotRegisteredError } from '../errors';
import { cleanup } from '../tests';

const config: DropConfig = {
  type: 'text',
  name: 'Text',
  description: 'A text drop.',
  create: () =>
    new Promise((resolve) => resolve(generateDrop({ type: 'text' }))),
};

const core = initializeCore({ appId: 'app', extensionId: 'drops' });

describe('unregisterDropType', () => {
  afterEach(() => {
    cleanup();
  });

  it('unregisters the drop type', () => {
    registerDropType(core, config);
    unregisterDropType(core, config.type);

    expect(useDropsStore.getState().registered.length).toBe(0);
  });

  it("dispatches a 'drops:unregister' event", (done) => {
    core.addEventListener('drops:unregister', (payload) => {
      expect(payload.data).toEqual(config);
      done();
    });

    registerDropType(core, config);
    unregisterDropType(core, config.type);
  });

  it('throws a DropTypeNotRegisteredError if the drop type is not registered', () => {
    expect(() => unregisterDropType(core, config.type)).toThrowError(
      DropTypeNotRegisteredError,
    );
  });
});
