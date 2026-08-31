import React, { useCallback } from 'react';
import {
  DataView,
  DataViewSortDirection,
  DataViewTypes,
  DataViews,
} from '@minddrop/data-views';
import { DefaultEntrySort } from '@minddrop/databases';
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  IconButtonColor,
  IconButtonSize,
  IconButtonVariant,
  MenuGroup,
  MenuLabel,
} from '@minddrop/ui-primitives';
import { useDataViewSortProperties } from '../useDataViewSortProperties';

export interface DataViewSortMenuProps {
  /**
   * The data view for which to render the sort menu.
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
 * Renders a dropdown menu button for setting the property a data
 * view's entries are sorted by and the direction they are sorted
 * in. Renders nothing when the view type is not sortable.
 */
export const DataViewSortMenu: React.FC<DataViewSortMenuProps> = ({
  view,
  size,
  variant,
  color = 'neutral',
  onOpenChange,
}) => {
  const viewType = DataViewTypes.use(view.type);
  const sortProperties = useDataViewSortProperties(view);

  // The view's sort options, falling back to the defaults the
  // sorter applies
  const sortBy = view.options?.sortBy ?? DefaultEntrySort.by;
  const sortProperty = view.options?.sortProperty ?? DefaultEntrySort.property;
  const sortDirection =
    view.options?.sortDirection ?? DefaultEntrySort.direction;

  // The sorted property, missing when the database no longer
  // declares it
  const selectedProperty = sortProperties.find(
    (property) => property.by === sortBy && property.property === sortProperty,
  );

  // Sort by the selected property
  const handleSortPropertyChange = useCallback(
    (value: string) => {
      const property = sortProperties.find(
        (candidate) => candidate.id === value,
      );

      if (!property) {
        return;
      }

      DataViews.updateOptions(view.id, {
        sortBy: property.by,
        sortProperty: property.property,
      });
    },
    [view.id, sortProperties],
  );

  // Sort in the selected direction
  const handleSortDirectionChange = useCallback(
    (value: string) => {
      DataViews.updateOptions(view.id, {
        sortDirection: value as DataViewSortDirection,
      });
    },
    [view.id],
  );

  // View types which position entries themselves have no sort
  if (!viewType?.sortable) {
    return null;
  }

  return (
    <DropdownMenuRoot onOpenChange={onOpenChange}>
      <DropdownMenuTrigger>
        <IconButton
          icon="arrow-down-up"
          label="dataViews.sort.label"
          tooltip={{ title: 'dataViews.sort.label' }}
          size={size}
          variant={variant}
          color={color}
        />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuPositioner side="bottom" align="end">
          <DropdownMenuContent>
            {/** Sorted property */}
            <MenuGroup>
              <MenuLabel label="dataViews.sort.property" />
              <DropdownMenuRadioGroup
                value={selectedProperty?.id ?? ''}
                onValueChange={handleSortPropertyChange}
              >
                {sortProperties.map((property) => (
                  <DropdownMenuRadioItem
                    key={property.id}
                    value={property.id}
                    stringLabel={property.label}
                    contentIcon={property.icon}
                  />
                ))}
              </DropdownMenuRadioGroup>
            </MenuGroup>

            <DropdownMenuSeparator />

            {/** Sort direction */}
            <MenuGroup>
              <MenuLabel label="dataViews.sort.direction" />
              <DropdownMenuRadioGroup
                value={sortDirection}
                onValueChange={handleSortDirectionChange}
              >
                <DropdownMenuRadioItem
                  value="ascending"
                  label="dataViews.sort.ascending"
                  icon="arrow-up-narrow-wide"
                />
                <DropdownMenuRadioItem
                  value="descending"
                  label="dataViews.sort.descending"
                  icon="arrow-down-wide-narrow"
                />
              </DropdownMenuRadioGroup>
            </MenuGroup>
          </DropdownMenuContent>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  );
};
