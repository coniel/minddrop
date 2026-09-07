import React from 'react';
import { DataView } from '@minddrop/data-views';
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  IconButton,
  IconButtonColor,
  IconButtonSize,
  IconButtonVariant,
} from '@minddrop/ui-primitives';
import { DataViewSettingsMenuContent } from './DataViewSettingsMenuContent';

export interface DataViewSettingsMenuProps {
  /**
   * The data view for which to render the settings menu.
   */
  view: DataView;

  /**
   * The size of the menu's trigger button.
   */
  size?: IconButtonSize;

  /**
   * The visual style of the menu's trigger button.
   */
  variant?: IconButtonVariant;

  /**
   * The colour of the menu's trigger button.
   */
  color?: IconButtonColor;

  /**
   * Called when the menu opens or closes.
   */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Renders a dropdown menu button holding a data view's settings:
 * renaming the view, picking its icon and the view type's own
 * settings.
 */
export const DataViewSettingsMenu: React.FC<DataViewSettingsMenuProps> = ({
  view,
  size,
  variant,
  color = 'neutral',
  onOpenChange,
}) => {
  return (
    <DropdownMenuRoot onOpenChange={onOpenChange}>
      <DropdownMenuTrigger>
        <IconButton
          icon="settings-2"
          label="dataViews.actions.settings"
          tooltip={{ title: 'dataViews.actions.settings' }}
          size={size}
          variant={variant}
          color={color}
        />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuPositioner side="bottom" align="end">
          <DropdownMenuContent>
            <DataViewSettingsMenuContent view={view} />
          </DropdownMenuContent>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  );
};
