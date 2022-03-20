import { setup, cleanup, extensions } from '../test-utils';
import { getRegisteredExtensions } from './getRegisteredExtensions';

describe('getEnabledExtensions', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns all registered extensions', () => {
    // Get registered extensions
    const registered = getRegisteredExtensions();

    // Should contain all registered extensions
    expect(registered.length).toEqual(extensions.length);
  });
});
