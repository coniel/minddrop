import { initializeCore } from '@minddrop/core';
import { cleanup, textDropConfig } from '../test-utils';
import { useDropsStore } from '../useDropsStore';
import { registerDropType } from './registerDropType';

const core = initializeCore({ appId: 'app', extensionId: 'drops' });

describe('registerDropType', () => {
  afterEach(cleanup);

  it('registers the drop type', () => {
    registerDropType(core, textDropConfig);

    expect(useDropsStore.getState().registered.length).toBe(1);
    expect(useDropsStore.getState().registered[0]).toEqual(textDropConfig);
  });

  it("dispatches a 'drops:register' event", (done) => {
    core.addEventListener('drops:register', (payload) => {
      expect(payload.data).toEqual(textDropConfig);
      done();
    });

    registerDropType(core, textDropConfig);
  });
});
