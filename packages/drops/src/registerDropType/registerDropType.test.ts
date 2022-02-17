import { cleanup, core, textDropConfig } from '../test-utils';
import { RegisteredDropConfig } from '../types';
import { useDropsStore } from '../useDropsStore';
import { registerDropType } from './registerDropType';

const registeredConfig: RegisteredDropConfig = {
  ...textDropConfig,
  extension: 'drops',
};

describe('registerDropType', () => {
  afterEach(cleanup);

  it('registers the drop type', () => {
    registerDropType(core, textDropConfig);

    expect(useDropsStore.getState().registered.length).toBe(1);
    expect(useDropsStore.getState().registered[0]).toEqual(registeredConfig);
  });

  it("dispatches a 'drops:register' event", (done) => {
    core.addEventListener('drops:register', (payload) => {
      expect(payload.data).toEqual(registeredConfig);
      done();
    });

    registerDropType(core, textDropConfig);
  });
});
