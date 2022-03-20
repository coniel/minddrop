import { setup, cleanup, core } from '../test-utils';
import { useExtensionsStore } from '../useExtensionsStore';
import { clearExtensions } from './clearExtensions';

describe('clearExtensions', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('clears the extensions store', () => {
    // Clear the extensions state
    clearExtensions(core);

    // Should clear the extension configs
    expect(useExtensionsStore.getState().extensionConfigs).toEqual({});
    // Should clear the extension documents
    expect(useExtensionsStore.getState().extensionDocuments).toEqual({});
  });

  it('dispatches a `extensions:clear` event', (done) => {
    // Listen to 'extensions:clear' events
    core.addEventListener('extensions:clear', () => {
      done();
    });

    // Clear the extensions state
    clearExtensions(core);
  });
});
