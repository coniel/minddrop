import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementConfigsStore } from '../DesignElementConfigsStore';
import { DesignElementConfigNotRegisteredError } from '../errors';
import { registerDesignElementConfig } from '../registerDesignElementConfig';
import { testElementConfig } from '../test-utils';
import { getDesignElementConfig } from './getDesignElementConfig';

describe('getDesignElementConfig', () => {
  beforeEach(() => {
    registerDesignElementConfig(testElementConfig);
  });

  afterEach(() => {
    DesignElementConfigsStore.clear();
  });

  it('returns the requested element type config', () => {
    expect(getDesignElementConfig(testElementConfig.type)).toBe(
      testElementConfig,
    );
  });

  it('throws if the element type is not registered', () => {
    expect(() => getDesignElementConfig('unknown')).toThrow(
      DesignElementConfigNotRegisteredError,
    );
  });

  it('returns null if the type is not registered and throwOnNotFound is false', () => {
    expect(getDesignElementConfig('unknown', false)).toBeNull();
  });
});
