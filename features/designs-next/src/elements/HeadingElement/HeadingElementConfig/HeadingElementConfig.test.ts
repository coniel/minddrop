import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs, Designs } from '@minddrop/designs-next';
import { cleanup } from '../../../test-utils';
import {
  HeadingElementConfig,
  HeadingElementType,
} from './HeadingElementConfig';

describe('HeadingElementConfig', () => {
  beforeEach(() => {
    DesignElementConfigs.register(HeadingElementConfig);
  });

  afterEach(() => {
    cleanup();
    DesignElementConfigs.Store.remove(HeadingElementType);
  });

  it('seeds new headings with the placeholder text', () => {
    const element = Designs.createElement(HeadingElementType);

    expect(element).toHaveProperty('content', 'Heading');
  });

  it('seeds new headings with a prominent size and weight', () => {
    const element = Designs.createElement(HeadingElementType);

    expect(element).toHaveProperty('fontSize', 24);
    expect(element).toHaveProperty('fontWeight', 600);
  });

  it('starts new headings at one line of their text', () => {
    const element = Designs.createElement(HeadingElementType);

    // 24px text needs nine units a line
    expect(element.rowSpan).toBe(9);
    expect(HeadingElementConfig.resolveMinRowSpan?.(element)).toBe(9);
  });
});
