import { setup, cleanup, extensions } from '../test-utils';
import { getAllExtensions } from './getAllExtensions';

describe('getEnabledExtensions', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns all registered extensions', () => {
    // Get registered extensions
    const registered = getAllExtensions();

    // Should contain all registered extensions
    expect(registered.length).toEqual(extensions.length);
  });
});
