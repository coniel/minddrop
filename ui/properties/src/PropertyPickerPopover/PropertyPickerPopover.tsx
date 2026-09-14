import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import { PropertiesSchema, PropertySchema } from '@minddrop/properties';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverPositionerProps,
  SearchableMenu,
} from '@minddrop/ui-primitives';
import { PropertyMenuItems } from '../PropertyMenuItems';

export interface PropertyPickerPopoverProps {
  /**
   * The element the popover is anchored to.
   */
  anchor: PopoverPositionerProps['anchor'];

  /**
   * Whether the popover is open.
   */
  open: boolean;

  /**
   * Callback fired when the popover is opened or closed.
   */
  onOpenChange(open: boolean): void;

  /**
   * The properties to pick from.
   */
  properties: PropertiesSchema;

  /**
   * Callback fired with the picked property.
   */
  onSelect(property: PropertySchema): void;

  /**
   * The side of the anchor the popover opens on. Defaults to
   * below it.
   */
  side?: PopoverPositionerProps['side'];

  /**
   * The alignment of the popover along the anchor's side.
   * Defaults to the start.
   */
  align?: PopoverPositionerProps['align'];
}

// Width of the picker, wide enough for a property name beside
// its icon.
const PickerWidth = 260;

/**
 * Renders a searchable list of properties in an anchored popover.
 */
export const PropertyPickerPopover: React.FC<PropertyPickerPopoverProps> = ({
  anchor,
  open,
  onOpenChange,
  properties,
  onSelect,
  side = 'bottom',
  align = 'start',
}) => {
  const { t } = useTranslation();

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverPortal>
        <PopoverPositioner anchor={anchor} side={side} align={align}>
          <PopoverContent
            minWidth={PickerWidth}
            render={
              <SearchableMenu
                searchPlaceholder="properties.picker.search"
                emptyText={t('properties.picker.noMatching')}
              >
                <PropertyMenuItems
                  properties={properties}
                  onSelect={onSelect}
                />
              </SearchableMenu>
            }
          />
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};
