import { ExtensionNotRegisteredError } from '../errors';
import {
  setup,
  cleanup,
  topicExtensionConfig,
  topicExtensionDocument,
} from '../test-utils';
import { getExtension } from './getExtension';

describe('getExtension', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the extension', () => {
    // Get an extension
    const extension = getExtension(topicExtensionConfig.id);

    // Should have ID
    expect(extension.id).toBe(topicExtensionConfig.id);
    // Should include config data
    expect(extension.name).toBe(topicExtensionConfig.name);
    // Should include document ID
    expect(extension.document).toBe(topicExtensionDocument.id);
    // Should include document data
    expect(extension.topics).toBe(topicExtensionDocument.topics);
  });

  it('throws an ExtensionNotRegisteredError if the extension is not registered', () => {
    expect(() => getExtension('unregistered')).toThrowError(
      ExtensionNotRegisteredError,
    );
  });
});
