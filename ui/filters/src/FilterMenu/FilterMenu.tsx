import React, { useRef, useState } from 'react';
import {
  Filters,
  PropertyFilter,
  PropertyFilterDraft,
} from '@minddrop/filters';
import { useTranslation } from '@minddrop/i18n';
import { PropertiesSchema, PropertySchema } from '@minddrop/properties';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  IconButtonColor,
  IconButtonSize,
  IconButtonVariant,
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
} from '@minddrop/ui-primitives';
import {
  PropertyMenuItems,
  PropertyPickerPopover,
} from '@minddrop/ui-properties';
import { FilterEditor } from './FilterEditor';
import { FilterItem } from './FilterItem';
import './FilterMenu.css';

export interface FilterMenuProps {
  /**
   * The filters listed by the menu.
   */
  filters: PropertyFilter[];

  /**
   * Callback fired with the filters after one is added, edited or
   * removed.
   */
  onFiltersChange(filters: PropertyFilter[]): void;

  /**
   * The properties a filter can be added on.
   */
  properties: PropertiesSchema;

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

// Width of the new filter form
const EditorWidth = 260;

/**
 * Renders a dropdown menu button for adding, editing and removing
 * property filters.
 */
export const FilterMenu: React.FC<FilterMenuProps> = ({
  filters,
  onFiltersChange,
  properties,
  size,
  variant,
  color = 'neutral',
  onOpenChange,
}) => {
  // The trigger the picker and the new filter form anchor to, so
  // that they open in place of the menu.
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Whether the filter list and the property picker are open
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  // The filter being added, persisted on done
  const [draft, setDraft] = useState<PropertyFilterDraft | null>(null);
  const { t } = useTranslation();

  // Whether the menu lists the properties to pick from, in place
  // of the filters, while there are none.
  const picking = filters.length === 0;
  // The schema of the draft's property
  const draftProperty = draft
    ? Filters.resolveProperty(draft, properties)
    : undefined;

  // Open or close the menu, reporting the change
  function handleMenuOpenChange(open: boolean): void {
    setMenuOpen(open);
    onOpenChange?.(open);
  }

  // Close the menu and open the property picker in its place
  function handleAddFilter(): void {
    setMenuOpen(false);
    setPickerOpen(true);
  }

  // Start a filter on the picked property, with its first operator
  function handlePickProperty(property: PropertySchema): void {
    setPickerOpen(false);
    setDraft({
      property: property.name,
      propertyType: property.type,
      operator: Filters.resolveOperators(property)[0] ?? '',
      value: undefined,
    });
  }

  // Drop the draft when its form closes without being done
  function handleDraftOpenChange(open: boolean): void {
    if (!open) {
      setDraft(null);
    }
  }

  // Drop the draft
  function handleDraftCancel(): void {
    setDraft(null);
  }

  function handleDraftDone(): void {
    // Add the draft if it is complete
    if (draft && Filters.isComplete(draft)) {
      onFiltersChange([...filters, draft]);
    }

    // Close the form
    setDraft(null);
  }

  // Replace the filter at the index with its edited version
  function handleFilterChange(index: number, edited: PropertyFilter): void {
    onFiltersChange(
      filters.map((filter, filterIndex) =>
        filterIndex === index ? edited : filter,
      ),
    );
  }

  function handleFilterRemove(index: number): void {
    // Close the menu when removing the last filter, rather than
    // swapping its content to the property list.
    if (filters.length === 1) {
      setMenuOpen(false);
    }

    // Remove the filter
    onFiltersChange([...filters.slice(0, index), ...filters.slice(index + 1)]);
  }

  return (
    <>
      <DropdownMenuRoot open={menuOpen} onOpenChange={handleMenuOpenChange}>
        <DropdownMenuTrigger>
          <IconButton
            ref={triggerRef}
            icon="list-filter"
            label="filters.menu.label"
            tooltip={{ title: 'filters.menu.label' }}
            size={size}
            variant={variant}
            color={color}
            highlighted={!picking}
          />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="bottom" align="start">
            {/* Key the content so that it remounts when it turns
                searchable, rather than gaining a search field in
                place. */}
            <DropdownMenuContent
              key={picking ? 'properties' : 'filters'}
              className="filter-menu"
              searchable={picking}
              searchPlaceholder="properties.picker.search"
              emptyText={t('properties.picker.noMatching')}
            >
              {picking && (
                <PropertyMenuItems
                  properties={properties}
                  onSelect={handlePickProperty}
                />
              )}

              {!picking &&
                filters.map((filter, index) => (
                  <FilterItem
                    key={index}
                    filter={filter}
                    property={Filters.resolveProperty(filter, properties)}
                    onChange={(edited) => handleFilterChange(index, edited)}
                    onRemove={() => handleFilterRemove(index)}
                  />
                ))}

              {!picking && <DropdownMenuSeparator />}

              {!picking && (
                <DropdownMenuItem
                  icon="plus"
                  label="filters.menu.add"
                  onSelect={handleAddFilter}
                />
              )}
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenuRoot>

      {/* The property picker in place of the menu, for adding to
          the listed filters */}
      <PropertyPickerPopover
        anchor={triggerRef}
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        properties={properties}
        onSelect={handlePickProperty}
      />

      {/* The new filter form in place of the menu */}
      <Popover open={draft !== null} onOpenChange={handleDraftOpenChange}>
        <PopoverPortal>
          <PopoverPositioner anchor={triggerRef} side="bottom" align="start">
            <PopoverContent
              minWidth={EditorWidth}
              className="filter-menu-editor"
            >
              {draft && (
                <FilterEditor
                  property={draftProperty}
                  filter={draft}
                  onChange={setDraft}
                  onCancel={handleDraftCancel}
                  onDone={handleDraftDone}
                />
              )}
            </PopoverContent>
          </PopoverPositioner>
        </PopoverPortal>
      </Popover>
    </>
  );
};
