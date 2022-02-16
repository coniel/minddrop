import { setup, cleanup, core, topicExtension } from '../test-utils';
import { useExtensionsStore } from '../useExtensionsStore';
import { clearExtensions } from './clearExtensions';

describe('clearExtensions', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('clears the extensions store', () => {
    useExtensionsStore.getState().setExtension(topicExtension);

    clearExtensions(core);

    expect(useExtensionsStore.getState().extensions).toEqual({});
  });

  it('dispatches a `extensions:clear` event', (done) => {
    core.addEventListener('extensions:clear', () => {
      done();
    });

    clearExtensions(core);
  });
});
