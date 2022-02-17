import { initializeCore } from '@minddrop/core';
import { useDropsStore } from '../useDropsStore';
import { registerDropType } from '../registerDropType';
import { unregisterDropType } from './unregisterDropType';
import { DropTypeNotRegisteredError } from '../errors';
import { cleanup, textDropConfig } from '../test-utils';
import { getDropTypeConfig } from '../getDropTypeConfig';

const core = initializeCore({ appId: 'app', extensionId: 'drops' });

describe('unregisterDropType', () => {
  afterEach(cleanup);

  it('unregisters the drop type', () => {
    registerDropType(core, textDropConfig);
    unregisterDropType(core, textDropConfig.type);

    expect(useDropsStore.getState().registered.length).toBe(0);
  });

  it("dispatches a 'drops:unregister' event", (done) => {
    registerDropType(core, textDropConfig);
    const registeredConfig = getDropTypeConfig(textDropConfig.type);

    core.addEventListener('drops:unregister', (payload) => {
      expect(payload.data).toEqual(registeredConfig);
      done();
    });

    unregisterDropType(core, textDropConfig.type);
  });

  it('throws a DropTypeNotRegisteredError if the drop type is not registered', () => {
    expect(() => unregisterDropType(core, textDropConfig.type)).toThrowError(
      DropTypeNotRegisteredError,
    );
  });
});