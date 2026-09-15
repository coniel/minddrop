import React, { useCallback, useMemo } from 'react';
import {
  ContentView,
  ContentViewTypes,
  ContentViews,
} from '@minddrop/content-views';
import { Events } from '@minddrop/events';
import {
  DropdownMenuItem,
  MenuRenameItem,
  MenuSeparator,
} from '@minddrop/ui-primitives';

export interface ContentViewSettingsMenuContentProps {
  /**
   * The content view the settings apply to.
   */
  view: ContentView;

  /**
   * Whether to include the view type's own settings. Omitted where
   * the view is not being looked at, such as a list of views.
   *
   * @default true
   */
  typeSettings?: boolean;
}

/**
 * Renders the items of a content view's settings menu: renaming the
 * view and picking its icon, the view type's own settings when it
 * has any and they are wanted, and deleting the view. Rendered
 * inside a menu content of the caller's choosing, so the same items
 * serve a dropdown and a context menu.
 */
export const ContentViewSettingsMenuContent: React.FC<
  ContentViewSettingsMenuContentProps
> = ({ view, typeSettings = true }) => {
  const viewType = ContentViewTypes.use(view.type);

  // Merge view type default options with the view's options
  const viewOptions = useMemo(
    () => ({ ...viewType?.defaultOptions, ...(view.options ?? {}) }),
    [viewType, view.options],
  );

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

  // Update the view's options
  const handleUpdateOptions = useCallback(
    (options: object) => {
      ContentViews.update(view.id, { options });
    },
    [view.id],
  );

  // Confirm the deletion before removing the view
  function handleDelete() {
    Events.dispatch(Events.events.OpenConfirmationDialog, {
      title: 'contentViews.delete.confirmation.title',
      message: 'contentViews.delete.confirmation.message',
      confirmLabel: 'contentViews.delete.confirmation.confirm',
      danger: true,
      onConfirm: () => {
        ContentViews.delete(view.id);
      },
    });
  }

  return (
    <>
      <MenuRenameItem
        value={view.name}
        contentIcon={view.icon}
        onValueChange={() => {}}
        onRename={handleRename}
        onSelectIcon={handleSelectIcon}
      />
      {typeSettings && viewType?.settingsMenu && (
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
      <DropdownMenuItem
        icon="trash"
        danger
        label="contentViews.actions.delete"
        onSelect={handleDelete}
      />
    </>
  );
};
