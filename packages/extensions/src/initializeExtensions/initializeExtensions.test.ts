import { getRegisteredExtensions } from '../getRegisteredExtensions';
import {
  cleanup,
  core,
  topicExtensionConfig,
  appExtensionConfig,
  disabledTopicExtension,
} from '../test-utils';
import { initializeExtensions } from './initializeExtensions';

describe('initializeExtensions', () => {
  // Start with a cleared state
  beforeAll(cleanup);

  afterEach(cleanup);

  it('registers the extensions', () => {
    // Initalize extensions
    initializeExtensions(core, [
      topicExtensionConfig,
      appExtensionConfig,
      disabledTopicExtension,
    ]);

    // Should register 3 extensions
    expect(getRegisteredExtensions().length).toBe(3);
  });

  it('runs enabled extensions', () => {
    // Enabled extension
    jest.spyOn(topicExtensionConfig, 'onRun');
    // Disabled extension
    jest.spyOn(disabledTopicExtension, 'onRun');

    // Initalize extensions
    initializeExtensions(core, [topicExtensionConfig, disabledTopicExtension]);

    // Should call enabled extension's onRun callback
    expect(topicExtensionConfig.onRun).toHaveBeenCalled();
    // Should not call disabled extension's onRun callback
    expect(disabledTopicExtension.onRun).not.toHaveBeenCalled();
  });
});
