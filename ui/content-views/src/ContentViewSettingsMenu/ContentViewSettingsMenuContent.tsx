import React, { useCallback, useMemo } from 'react';
import {
  ContentView,
  ContentViewTypes,
  ContentViews,
} from '@minddrop/content-views';
import { MenuSeparator } from '@minddrop/ui-primitives';
import { ContentViewDeleteMenuItem } from './ContentViewDeleteMenuItem';
import { ContentViewRenameMenuItem } from './ContentViewRenameMenuItem';

export interface ContentViewSettingsMenuContentProps {
  /**
   * The content view the settings apply to.
   */
  view: ContentView;
}

/**
 * Renders the items of a content view's settings menu: renaming the
 * view and picking its icon, the view type's own settings when it
 * has any, and deleting the view. Rendered inside a menu content of
 * the caller's choosing, so the same items serve a dropdown and a
 * context menu.
 */
export const ContentViewSettingsMenuContent: React.FC<
  ContentViewSettingsMenuContentProps
> = ({ view }) => {
  const viewType = ContentViewTypes.use(view.type);

  // Merge view type default options with the view's options
  const viewOptions = useMemo(
    () => ({ ...viewType?.defaultOptions, ...(view.options ?? {}) }),
    [viewType, view.options],
  );

  // Update the view's options
  const handleUpdateOptions = useCallback(
    (options: object) => {
      ContentViews.update(view.id, { options });
    },
    [view.id],
  );

  return (
    <>
      <ContentViewRenameMenuItem view={view} />
      {viewType?.settingsMenu && (
        <>
          <MenuSeparator />
          {React.createElement(viewType.settingsMenu, {
            view,
            options: viewOptions,
            onUpdateOptions: handleUpdateOptions,
          })}
        </>
      )}
      <MenuSeparator />
      <ContentViewDeleteMenuItem view={view} />
    </>
  );
};
