import { useMemo } from 'react';
import { Filters, PropertyFilterValue } from '@minddrop/filters';
import { useTranslation } from '@minddrop/i18n';
import { Combobox, ComboboxOption } from '@minddrop/ui-primitives';

interface PropertyFilterCollectionValueInputProps {
  /**
   * The filter's current comparison value.
   */
  value?: PropertyFilterValue;

  /**
   * Callback fired with the new value.
   */
  onChange(value: PropertyFilterValue | undefined): void;
}

/**
 * Renders a searchable multi item picker listing the items of
 * every filterable entity type, showing the picked items as
 * chips.
 */
export const PropertyFilterCollectionValueInput: React.FC<
  PropertyFilterCollectionValueInputProps
> = ({ value, onChange }) => {
  const { t } = useTranslation({ keyPrefix: 'filters.fields' });

  // The picked item IDs
  const pickedIds = Array.isArray(value) ? value : [];

  // List the filterable items as options
  const options = useMemo<ComboboxOption[]>(
    () =>
      Filters.listItems().map((item) => ({
        label: item.label,
        value: item.id,
        contentIcon: item.icon,
      })),
    [],
  );

  // The picked items' options, shown as chips
  const selected = options.filter((option) => pickedIds.includes(option.value));

  // Reports the picked items' IDs, treating cleared picks as
  // unset.
  function handleValueChange(
    picked: ComboboxOption | ComboboxOption[] | null,
  ): void {
    // Single values never occur in multi-select mode
    if (!Array.isArray(picked)) {
      return;
    }

    // Report the picked IDs
    onChange(picked.length ? picked.map((option) => option.value) : undefined);
  }

  return (
    <Combobox
      multiple
      size="md"
      items={options}
      placeholder={t('selectItems')}
      searchPlaceholder="filters.fields.searchItems"
      emptyText={t('noMatchingItems')}
      value={selected}
      onValueChange={handleValueChange}
    />
  );
};
