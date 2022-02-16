import { getExtension } from '../getExtension';
import { setup, cleanup, core, unregisteredExtension } from '../test-utils';
import { registerExtension } from './registerExtension';

describe('registerExtension', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the extension to the extensions store', () => {
    registerExtension(core, unregisteredExtension);

    expect(getExtension(unregisteredExtension.id)).toBeDefined();
  });

  it('dispatches a `extensions:register` event', (done) => {
    core.addEventListener('extensions:register', (payload) => {
      expect(payload.data.id).toEqual(unregisteredExtension.id);
      done();
    });

    registerExtension(core, unregisteredExtension);
  });
});
