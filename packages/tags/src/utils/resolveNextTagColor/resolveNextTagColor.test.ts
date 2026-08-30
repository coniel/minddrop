import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentColors } from '@minddrop/ui-theme';
import { TagsStore } from '../../TagsStore';
import { cleanup, setup, tags } from '../../test-utils';
import { resolveNextTagColor } from './resolveNextTagColor';

const rotationColors = ContentColors.filter((color) => color !== 'default');

describe('resolveNextTagColor', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the color at the current tag count in the rotation', () => {
    expect(resolveNextTagColor()).toBe(rotationColors[tags.length]);
  });

  it('wraps around when the tag count exceeds the color count', () => {
    // Load enough extra tags to wrap the rotation
    TagsStore.load(
      rotationColors.map((color, index) => ({
        ...tags[0],
        id: `tag_extra-${index}`,
        name: `Extra ${index}`,
      })),
    );

    expect(resolveNextTagColor()).toBe(rotationColors[tags.length]);
  });

  it('never returns the default color', () => {
    expect(resolveNextTagColor()).not.toBe('default');
  });
});
