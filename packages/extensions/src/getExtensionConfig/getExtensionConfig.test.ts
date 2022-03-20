import { ExtensionNotRegisteredError } from '../errors';
import { setup, cleanup, topicExtensionConfig } from '../test-utils';
import { getExtensionConfig } from './getExtensionConfig';

describe('getExtensionConfig', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the extension config', () => {
    // Get the extension config
    const config = getExtensionConfig(topicExtensionConfig.id);

    // Should match stored config
    expect(config).toEqual(topicExtensionConfig);
  });

  it('throws a ExtensionNotRegisteredError if the extension config does not exist', () => {
    // Should throw an error
    expect(() => getExtensionConfig('missing')).toThrowError(
      ExtensionNotRegisteredError,
    );
  });
});
