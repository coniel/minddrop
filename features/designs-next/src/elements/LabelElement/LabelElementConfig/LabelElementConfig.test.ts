import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs, Designs } from '@minddrop/designs-next';
import { cleanup } from '../../../test-utils';
import { LabelElementConfig, LabelElementType } from './LabelElementConfig';

describe('LabelElementConfig', () => {
  beforeEach(() => {
    DesignElementConfigs.register(LabelElementConfig);
  });

  afterEach(() => {
    cleanup();
    DesignElementConfigs.Store.remove(LabelElementType);
  });

  it('seeds new labels with the placeholder text', () => {
    const element = Designs.createElement(LabelElementType);

    expect(element).toHaveProperty('content', 'Label');
  });

  it('starts new labels at one line of their text', () => {
    const element = Designs.createElement(LabelElementType);

    // 14px text needs five units a line
    expect(element.rowSpan).toBe(5);
    expect(LabelElementConfig.resolveMinRowSpan?.(element)).toBe(5);
  });
});
