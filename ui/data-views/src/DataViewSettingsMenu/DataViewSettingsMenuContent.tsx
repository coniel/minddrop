import React, { useCallback, useMemo } from 'react';
import { DataView, DataViewTypes, DataViews } from '@minddrop/data-views';
import { Events } from '@minddrop/events';
import {
  DropdownMenuItem,
  MenuRenameItem,
  MenuSeparator,
} from '@minddrop/ui-primitives';

export interface DataViewSettingsMenuContentProps {
  /**
   * The data view the settings apply to.
   */
  view: DataView;

  /**
   * Whether to include the view type's own settings. Omitted where
   * the view is not being looked at, such as a list of views.
   *
   * @default true
   */
  typeSettings?: boolean;
}

/**
 * Renders the items of a data view's settings menu: renaming the
 * view and picking its icon, the view type's own settings when it
 * has any and they are wanted, and deleting the view. Rendered
 * inside a menu content of the caller's choosing, so the same items
 * serve a dropdown and a context menu.
 */
export const DataViewSettingsMenuContent: React.FC<
  DataViewSettingsMenuContentProps
> = ({ view, typeSettings = true }) => {
  const viewType = DataViewTypes.use(view.type);

  // Merge view type default options with the view's options
  const viewOptions = useMemo(
    () => ({ ...viewType?.defaultOptions, ...(view.options ?? {}) }),
    [viewType, view.options],
  );

  const handleRename = useCallback(
    (name: string) => {
      DataViews.update(view.id, { name });
    },
    [view.id],
  );

  const handleSelectIcon = useCallback(
    (icon: string) => {
      DataViews.update(view.id, { icon });
    },
    [view.id],
  );

  // Update the view's options
  const handleUpdateOptions = useCallback(
    (options: object) => {
      DataViews.update(view.id, { options });
    },
    [view.id],
  );

  // Confirm the deletion before removing the view
  function handleDelete() {
    Events.dispatch(Events.events.OpenConfirmationDialog, {
      title: 'dataViews.delete.confirmation.title',
      message: 'dataViews.delete.confirmation.message',
      confirmLabel: 'dataViews.delete.confirmation.confirm',
      danger: true,
      onConfirm: () => {
        DataViews.delete(view.id);
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
        label="dataViews.actions.delete"
        onSelect={handleDelete}
      />
    </>
  );
};
