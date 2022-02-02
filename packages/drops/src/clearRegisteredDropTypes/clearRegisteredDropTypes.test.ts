import { clearRegisteredDropTypes } from './clearRegisteredDropTypes';
import { registerDropType } from '../registerDropType';
import { cleanup, core, imageDropConfig, textDropConfig } from '../tests';
import { getRegisteredDropTypes } from '../getRegisteredDropTypes';

describe('clearRegisteredDropTypes', () => {
  afterEach(() => {
    cleanup();
  });

  it('clears registered drop types from the store', () => {
    registerDropType(core, textDropConfig);
    registerDropType(core, imageDropConfig);

    clearRegisteredDropTypes(core);

    expect(getRegisteredDropTypes().length).toBe(0);
  });

  it("dispatches a 'drops:clear-register' event", (done) => {
    function callback() {
      done();
    }

    core.addEventListener('drops:clear-register', callback);

    clearRegisteredDropTypes(core);
  });
});
