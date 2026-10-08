import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs, Designs } from '@minddrop/designs-next';
import { cleanup } from '../../../test-utils';
import { NumberElementConfig, NumberElementType } from './NumberElementConfig';

describe('NumberElementConfig', () => {
  beforeEach(() => {
    DesignElementConfigs.register(NumberElementConfig);
  });

  afterEach(() => {
    cleanup();
    DesignElementConfigs.Store.remove(NumberElementType);
  });

  it('starts new numbers at one line of their text', () => {
    const element = Designs.createElement(NumberElementType);

    // 14px text needs five units a line
    expect(element.rowSpan).toBe(5);
    expect(NumberElementConfig.resolveMinRowSpan?.(element)).toBe(5);
  });
});
