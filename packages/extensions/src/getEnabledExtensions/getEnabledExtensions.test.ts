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
    const enabled = getEnabledExtensions();

    expect(enabled.length).toEqual(enabledExtensions.length);
    expect(
      enabled.find((extension) => extension.id === disabledTopicExtension.id),
    ).toBe(undefined);
  });
});
