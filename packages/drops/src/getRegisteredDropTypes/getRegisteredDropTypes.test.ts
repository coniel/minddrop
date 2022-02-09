import { getRegisteredDropTypes } from './getRegisteredDropTypes';
import {
  setup,
  cleanup,
  dropTypeConfigs,
  htmlDropConfig,
  imageDropConfig,
} from '../test-utils';

describe('getRegisteredDropTypes', () => {
  beforeAll(() => {
    setup();
  });

  afterAll(() => {
    cleanup();
  });

  it('returns the registered drop type configs', () => {
    const configs = getRegisteredDropTypes();

    expect(configs).toEqual(dropTypeConfigs);
  });

  it('filters by drop type', () => {
    const configs = getRegisteredDropTypes(['image', 'html']);

    expect(configs).toEqual([htmlDropConfig, imageDropConfig]);
  });
});
