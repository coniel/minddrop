import React from 'react';
import { PropertyFilterValue } from '@minddrop/filters';
import { useTranslation } from '@minddrop/i18n';
import { SelectPropertySchema } from '@minddrop/properties';
import {
  ChipMenuItem,
  Combobox,
  ComboboxOption,
} from '@minddrop/ui-primitives';
import { toArray } from '@minddrop/utils';

interface PropertyFilterSelectValueInputProps {
  /**
   * The property's options.
   */
  options: SelectPropertySchema['options'];

  /**
   * The filter's current comparison value.
   */
  value?: PropertyFilterValue;

  /**
   * Callback fired with the new value.
   */
  onChange(value: PropertyFilterValue | undefined): void;
}

// Beyond this many options the checklist gives way to a
// searchable combobox.
const ChecklistLimit = 10;

/**
 * Renders a select property's options as a checklist, or as a
 * searchable combobox for long option lists.
 */
export const PropertyFilterSelectValueInput: React.FC<
  PropertyFilterSelectValueInputProps
> = ({ options, value, onChange }) => {
  const { t } = useTranslation();

  // The checked options
  const picked = toArray(value).filter(
    (item): item is string => typeof item === 'string',
  );

  // Reports the combobox's picked options, treating cleared picks
  // as unset.
  function handleComboboxChange(
    selected: ComboboxOption | ComboboxOption[] | null,
  ): void {
    // Single values never occur in multi-select mode
    if (!Array.isArray(selected)) {
      return;
    }

    // Report the picked option values
    onChange(selected.length ? selected.map((item) => item.value) : undefined);
  }

  // Render a combobox for long option lists
  if (options.length > ChecklistLimit) {
    // The options as combobox items
    const items: ComboboxOption[] = options.map((option) => ({
      label: option.value,
      value: option.value,
      color: option.color,
    }));

    return (
      <Combobox
        multiple
        size="md"
        items={items}
        placeholder={t('filters.fields.value')}
        searchPlaceholder="filters.fields.searchOptions"
        emptyText={t('filters.fields.noMatchingOptions')}
        value={items.filter((item) => picked.includes(item.value))}
        onValueChange={handleComboboxChange}
      />
    );
  }

  // Toggles an option
  function handleToggle(option: string): void {
    // Remove a checked option, or add an unchecked one
    const next = picked.includes(option)
      ? picked.filter((item) => item !== option)
      : [...picked, option];

    // Report the checked options, treating cleared picks as unset
    onChange(next.length ? next : undefined);
  }

  return (
    <div role="group" className="property-filter-select-value-input">
      {options.map((option) => (
        <ChipMenuItem
          key={option.value}
          checkbox
          checked={picked.includes(option.value)}
          color={option.color}
          stringLabel={option.value}
          onClick={() => handleToggle(option.value)}
        />
      ))}
    </div>
  );
};
