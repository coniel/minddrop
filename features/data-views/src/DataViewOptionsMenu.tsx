import React, { useCallback, useMemo } from 'react';
import { DataView, DataViewTypes, DataViews } from '@minddrop/data-views';
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  IconButton,
} from '@minddrop/ui-primitives';

export interface DataViewOptionsMenuProps {
  /**
   * The data view for which to render the options menu.
   */
  view: DataView;
}

/**
 * Renders a dropdown menu button containing the data view type's
 * settings menu. Renders nothing when the view type does not
 * provide a settings menu.
 */
export const DataViewOptionsMenu: React.FC<DataViewOptionsMenuProps> = ({
  view,
}) => {
  const viewType = DataViewTypes.use(view.type);

  // Merge view type default options with the view's options
  const viewOptions = useMemo(
    () => ({ ...viewType?.defaultOptions, ...(view.options ?? {}) }),
    [viewType, view.options],
  );

  // Update the view's options
  const handleUpdateOptions = useCallback(
    (options: object) => {
      DataViews.update(view.id, { options });
    },
    [view.id],
  );

  // Nothing to render when the view type has no settings menu
  if (!viewType?.settingsMenu) {
    return null;
  }

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <IconButton
          icon="settings-2"
          label="dataViews.actions.settings"
          color="neutral"
        />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuPositioner side="bottom" align="end">
          <DropdownMenuContent>
            {React.createElement(viewType.settingsMenu, {
              view,
              options: viewOptions,
              onUpdateOptions: handleUpdateOptions,
            })}
          </DropdownMenuContent>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  );
};
