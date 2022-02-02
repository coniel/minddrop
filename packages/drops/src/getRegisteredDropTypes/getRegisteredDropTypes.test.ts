import { getRegisteredDropTypes } from './getRegisteredDropTypes';
import {
  initialize,
  cleanup,
  dropTypeConfigs,
  htmlDropConfig,
  imageDropConfig,
} from '../tests';

describe('getRegisteredDropTypes', () => {
  beforeAll(() => {
    initialize();
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
