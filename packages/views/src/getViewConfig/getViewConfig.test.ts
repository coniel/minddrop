import { core, staticViewConfig } from '../test-utils';
import { ViewNotRegisteredError } from '../errors';
import { registerView } from '../registerView';
import { getViewConfig } from './getViewConfig';

describe('getView', () => {
  beforeEach(() => {
    // Register a test view
    registerView(core, staticViewConfig);
  });

  it('returns the view', () => {
    // Get a view config
    const config = getViewConfig(staticViewConfig.id);

    // Should return the registered view config
    expect(config).toEqual({
      ...config,
      extension: core.extensionId,
    });
  });

  it('thows a `ViewNotRegisteredError` if the view is not registered', () => {
    // Attempt to retrieve an unregistered view config.
    // Should throw a `ViewNotRegisteredError`.
    expect(() => getViewConfig('unregistered')).toThrowError(
      ViewNotRegisteredError,
    );
  });
});
