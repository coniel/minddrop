import { ExtensionNotRegisteredError } from '../errors';
import { setup, cleanup, topicExtension } from '../test-utils';
import { useExtensionsStore } from '../useExtensionsStore';
import { getExtension } from './getExtension';

describe('getExtension', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the extension from the store', () => {
    useExtensionsStore.getState().setExtension(topicExtension);

    expect(getExtension(topicExtension.id)).toBe(topicExtension);
  });

  it('throws an ExtensionNotRegisteredError if the extension is not registered', () => {
    expect(() => getExtension('unregistered')).toThrowError(
      ExtensionNotRegisteredError,
    );
  });
});
