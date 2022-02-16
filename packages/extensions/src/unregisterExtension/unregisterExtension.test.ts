import { ExtensionNotRegisteredError } from '../errors';
import { getExtension } from '../getExtension';
import { setup, cleanup, topicExtension, core } from '../test-utils';
import { unregisterExtension } from './unregisterExtension';

describe('unregisterExtension', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the extension from the store', () => {
    unregisterExtension(core, topicExtension.id);

    expect(() => getExtension(topicExtension.id)).toThrowError(
      ExtensionNotRegisteredError,
    );
  });

  it('dispatches a `extensions:unregister` event', (done) => {
    core.addEventListener('extensions:unregister', (payload) => {
      expect(payload.data.id).toBe(topicExtension.id);
      done();
    });

    unregisterExtension(core, topicExtension.id);
  });
});
