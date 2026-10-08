import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs, Designs } from '@minddrop/designs-next';
import { cleanup } from '../../../test-utils';
import { LinkElementConfig, LinkElementType } from './LinkElementConfig';

describe('LinkElementConfig', () => {
  beforeEach(() => {
    DesignElementConfigs.register(LinkElementConfig);
  });

  afterEach(() => {
    cleanup();
    DesignElementConfigs.Store.remove(LinkElementType);
  });

  it('seeds new links with the placeholder content', () => {
    const element = Designs.createElement(LinkElementType);

    expect(element).toHaveProperty('content', 'Link');
  });

  it('starts new links at one line of their text', () => {
    const element = Designs.createElement(LinkElementType);

    // 14px text needs five units a line
    expect(element.rowSpan).toBe(5);
    expect(LinkElementConfig.resolveMinRowSpan?.(element)).toBe(5);
  });
});
