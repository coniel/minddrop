import React, { useCallback } from 'react';
import { ContentView, ContentViews } from '@minddrop/content-views';
import { MenuRenameItem } from '@minddrop/ui-primitives';

export interface ContentViewRenameMenuItemProps {
  /**
   * The content view the item renames.
   */
  view: ContentView;
}

/**
 * Renders the menu item renaming a content view and picking its
 * icon.
 */
export const ContentViewRenameMenuItem: React.FC<
  ContentViewRenameMenuItemProps
> = ({ view }) => {
  const handleRename = useCallback(
    (name: string) => {
      ContentViews.update(view.id, { name });
    },
    [view.id],
  );

  const handleSelectIcon = useCallback(
    (icon: string) => {
      ContentViews.update(view.id, { icon });
    },
    [view.id],
  );

  return (
    <MenuRenameItem
      value={view.name}
      contentIcon={view.icon}
      onValueChange={() => {}}
      onRename={handleRename}
      onSelectIcon={handleSelectIcon}
    />
  );
};
