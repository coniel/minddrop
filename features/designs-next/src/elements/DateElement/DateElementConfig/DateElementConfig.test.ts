import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs, Designs } from '@minddrop/designs-next';
import { cleanup } from '../../../test-utils';
import { DateElementConfig, DateElementType } from './DateElementConfig';

describe('DateElementConfig', () => {
  beforeEach(() => {
    DesignElementConfigs.register(DateElementConfig);
  });

  afterEach(() => {
    cleanup();
    DesignElementConfigs.Store.remove(DateElementType);
  });

  it('starts new dates at one line of their text', () => {
    const element = Designs.createElement(DateElementType);

    // 14px text needs five units a line
    expect(element.rowSpan).toBe(5);
    expect(DateElementConfig.resolveMinRowSpan?.(element)).toBe(5);
  });
});
