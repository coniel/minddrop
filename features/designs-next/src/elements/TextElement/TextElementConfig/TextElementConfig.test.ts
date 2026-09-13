import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs, Designs } from '@minddrop/designs-next';
import { cleanup } from '../../../test-utils';
import { TextElementConfig, TextElementType } from './TextElementConfig';

describe('TextElementConfig', () => {
  beforeEach(() => {
    DesignElementConfigs.register(TextElementConfig);
  });

  afterEach(() => {
    cleanup();
    DesignElementConfigs.Store.remove(TextElementType);
  });

  it('seeds new text elements with the placeholder text', () => {
    const element = Designs.createElement(TextElementType);

    expect(element).toHaveProperty('content', 'Text');
  });

  it('floors the block at one line of its text', () => {
    const element = Designs.createElement(TextElementType);

    // 14px text needs five units a line, 20px text seven
    expect(TextElementConfig.resolveMinRowSpan?.(element)).toBe(5);
    expect(
      TextElementConfig.resolveMinRowSpan?.({ ...element, fontSize: 20 }),
    ).toBe(7);
  });
});
