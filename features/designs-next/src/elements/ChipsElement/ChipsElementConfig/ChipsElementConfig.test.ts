import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs, Designs } from '@minddrop/designs-next';
import { cleanup } from '../../../test-utils';
import { ChipsElementConfig, ChipsElementType } from './ChipsElementConfig';

describe('ChipsElementConfig', () => {
  beforeEach(() => {
    DesignElementConfigs.register(ChipsElementConfig);
  });

  afterEach(() => {
    cleanup();
    DesignElementConfigs.Store.remove(ChipsElementType);
  });

  it('seeds new chips with the placeholder text', () => {
    const element = Designs.createElement(ChipsElementType);

    expect(element).toHaveProperty('content', 'Chip');
  });

  it('starts new chips at one line of medium chips', () => {
    const element = Designs.createElement(ChipsElementType);

    // A medium chip is 22px tall, six units
    expect(element.rowSpan).toBe(6);
    expect(ChipsElementConfig.resolveMinRowSpan?.(element)).toBe(6);
  });

  it('floors the block at one line of the chips at their size', () => {
    const element = Designs.createElement(ChipsElementType);

    // A large chip is 26px tall, seven units
    expect(
      ChipsElementConfig.resolveMinRowSpan?.({ ...element, size: 'lg' }),
    ).toBe(7);
  });
});
