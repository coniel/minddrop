import { describe, expect, it, vi } from 'vitest';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { MenuItemConfig } from '@minddrop/ui-primitives';
import { resolveContentViewTypeActions } from './resolveContentViewTypeActions';

const { contentViewType_gallery, contentViewType_table } = ContentViewFixtures;

const viewTypes = [contentViewType_gallery, contentViewType_table];

describe('resolveContentViewTypeActions', () => {
  it('lists an action per view type', () => {
    const actions = resolveContentViewTypeActions(viewTypes, () => {});

    expect(actions).toHaveLength(viewTypes.length);
    expect((actions[0] as MenuItemConfig).label).toBe(
      contentViewType_gallery.name,
    );
  });

  it('hands the selected view type to the callback', () => {
    const onSelectViewType = vi.fn();
    const actions = resolveContentViewTypeActions(viewTypes, onSelectViewType);

    (actions[1] as MenuItemConfig).onSelect?.();

    expect(onSelectViewType).toHaveBeenCalledWith(contentViewType_table.type);
  });
});
