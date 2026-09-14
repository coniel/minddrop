import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs, Designs } from '@minddrop/designs-next';
import { cleanup } from '../../../test-utils';
import {
  EditorTitleElementConfig,
  EditorTitleElementType,
} from './EditorTitleElementConfig';

describe('EditorTitleElementConfig', () => {
  beforeEach(() => {
    DesignElementConfigs.register(EditorTitleElementConfig);
  });

  afterEach(() => {
    cleanup();
    DesignElementConfigs.Store.remove(EditorTitleElementType);
  });

  it('seeds new titles at a title size and weight', () => {
    const element = Designs.createElement(EditorTitleElementType);

    expect(element).toHaveProperty('fontSize', 32);
    expect(element).toHaveProperty('fontWeight', 600);
  });

  it("takes no static content, a title being the entry's own", () => {
    expect(EditorTitleElementConfig.contentControls).toBeUndefined();
    expect(Designs.createElement(EditorTitleElementType)).not.toHaveProperty(
      'content',
    );
  });

  it('floors the block at one line of its text', () => {
    const element = Designs.createElement(EditorTitleElementType);

    // 32px text needs 12 units a line, 14px five
    expect(EditorTitleElementConfig.resolveMinRowSpan?.(element)).toBe(12);
    expect(
      EditorTitleElementConfig.resolveMinRowSpan?.({
        ...element,
        fontSize: 14,
      }),
    ).toBe(5);
  });
});
