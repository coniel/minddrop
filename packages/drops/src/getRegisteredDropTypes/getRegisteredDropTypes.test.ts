import { getRegisteredDropTypes } from './getRegisteredDropTypes';
import {
  setup,
  cleanup,
  registeredHtmlDropConfig,
  registeredImageDropConfig,
  registeredDropTypeConfigs,
  textDropConfig,
} from '../test-utils';
import { registerDropType } from '../registerDropType';
import { initializeCore } from '@minddrop/core';
import { getDropTypeConfig } from '../getDropTypeConfig';

describe('getRegisteredDropTypes', () => {
  beforeAll(() => {
    setup();
  });

  afterAll(() => {
    cleanup();
  });

  it('returns the registered drop type configs', () => {
    const configs = getRegisteredDropTypes();

    expect(configs).toEqual(registeredDropTypeConfigs);
  });

  it('filters by drop type', () => {
    const configs = getRegisteredDropTypes({ type: ['image', 'html'] });

    expect(configs).toEqual([
      registeredHtmlDropConfig,
      registeredImageDropConfig,
    ]);
  });

  it('filters by extension ID', () => {
    const extensionCore = initializeCore({
      appId: 'app',
      extensionId: 'my-extension',
    });
    registerDropType(extensionCore, { ...textDropConfig, type: 'custom-type' });

    const configs = getRegisteredDropTypes({ extension: ['my-extension'] });
    const customConfig = getDropTypeConfig('custom-type');

    expect(configs).toEqual([customConfig]);
  });
});
