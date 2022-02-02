import { initializeCore } from '@minddrop/core';
import { generateDrop } from '../generateDrop';
import { cleanup } from '../tests';
import { DropConfig } from '../types';
import { useDropsStore } from '../useDropsStore';
import { registerDropType } from './registerDropType';

const config: DropConfig = {
  type: 'text',
  name: 'Text',
  description: 'A text drop.',
  create: () =>
    new Promise((resolve) => resolve(generateDrop({ type: 'text' }))),
};

const core = initializeCore({ appId: 'app', extensionId: 'drops' });

describe('registerDropType', () => {
  afterEach(() => {
    cleanup();
  });

  it('registers the drop type', () => {
    registerDropType(core, config);

    expect(useDropsStore.getState().registered.length).toBe(1);
    expect(useDropsStore.getState().registered[0]).toEqual(config);
  });

  it("dispatches a 'drops:register' event", (done) => {
    core.addEventListener('drops:register', (payload) => {
      expect(payload.data).toEqual(config);
      done();
    });

    registerDropType(core, config);
  });
});
