import React from 'react';
import { ContentView } from '@minddrop/content-views';
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
import { ContentViewSettingsMenuContent } from './ContentViewSettingsMenuContent';

export interface ContentViewSettingsMenuProps {
  /**
   * The content view for which to render the settings menu.
   */
  view: ContentView;

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
 * Renders a dropdown menu button holding a content view's settings:
 * renaming the view, picking its icon and the view type's own
 * settings.
 */
export const ContentViewSettingsMenu: React.FC<
  ContentViewSettingsMenuProps
> = ({ view, size, variant, color = 'neutral', onOpenChange }) => {
  return (
    <DropdownMenuRoot onOpenChange={onOpenChange}>
      <DropdownMenuTrigger>
        <IconButton
          icon="settings-2"
          label="contentViews.actions.settings"
          tooltip={{ title: 'contentViews.actions.settings' }}
          size={size}
          variant={variant}
          color={color}
        />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuPositioner side="bottom" align="end">
          <DropdownMenuContent>
            <ContentViewSettingsMenuContent view={view} />
          </DropdownMenuContent>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  );
};
