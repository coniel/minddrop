import {
  setup,
  cleanup,
  enabledExtensions,
  disabledTopicExtension,
} from '../test-utils';
import { getEnabledExtensions } from './getEnabledExtensions';

describe('getEnabledExtensions', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns all enabled extensions', () => {
    // Get enabled extensions
    const enabled = getEnabledExtensions();

    // Should include all enabled extensions
    expect(enabled.length).toEqual(enabledExtensions.length);
    // Should not include the disabled extension
    expect(
      enabled.find((extension) => extension.id === disabledTopicExtension.id),
    ).toBe(undefined);
  });
});
