import React, { useState } from 'react';
import {
  Filters,
  PropertyFilter,
  PropertyFilterDraft,
} from '@minddrop/filters';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import { PropertySchema } from '@minddrop/properties';
import {
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownSubmenu,
  DropdownSubmenuContent,
  DropdownSubmenuTriggerItem,
} from '@minddrop/ui-primitives';
import { FilterEditor } from './FilterEditor';

export interface FilterItemProps {
  /**
   * The filter listed by the item.
   */
  filter: PropertyFilter;

  /**
   * The schema of the filtered property. Missing when the
   * property no longer exists.
   */
  property?: PropertySchema;

  /**
   * Callback fired with the edited filter once it is complete.
   */
  onChange(filter: PropertyFilter): void;

  /**
   * Callback fired when the filter is removed.
   */
  onRemove(): void;
}

// Builds operator label translation keys
const operatorI18nKey = createI18nKeyBuilder('filters.operators.');

// Width of the editor submenu
const EditorWidth = 260;

/**
 * Renders a filter as a submenu item reading "[property]
 * [operator] [value]", whose submenu holds the filter's editor.
 */
export const FilterItem: React.FC<FilterItemProps> = ({
  filter,
  property,
  onChange,
  onRemove,
}) => {
  // The filter's edits, reported once they form a complete filter
  const [draft, setDraft] = useState<PropertyFilterDraft>(filter);
  const { t } = useTranslation();

  // The property name, taken from the schema since metadata
  // properties store a translated name.
  const label = property?.name ?? filter.property;
  // The operator and value, shown after the property name
  const value = property ? Filters.formatValue(filter, property) : '';
  const detail = `${t(operatorI18nKey(filter.operator))} ${value}`.trim();

  function handleChange(edited: PropertyFilterDraft): void {
    // Hold the edit
    setDraft(edited);

    // Report the filter once it is complete
    if (Filters.isComplete(edited)) {
      onChange(edited);
    }
  }

  return (
    <DropdownSubmenu>
      <DropdownSubmenuTriggerItem
        stringLabel={label}
        stringDetail={detail}
        contentIcon={property?.icon}
      />
      <DropdownMenuPortal>
        <DropdownMenuPositioner side="right" align="start" sideOffset={4}>
          <DropdownSubmenuContent
            minWidth={EditorWidth}
            className="filter-item-editor"
          >
            <FilterEditor
              property={property}
              filter={draft}
              onChange={handleChange}
              onRemove={onRemove}
            />
          </DropdownSubmenuContent>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownSubmenu>
  );
};
