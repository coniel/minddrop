import { FC, useMemo } from 'react';
import { Database, Databases } from '@minddrop/databases';
import { useTranslation } from '@minddrop/i18n';
import {
  Combobox,
  ComboboxOption,
  ComboboxProps,
} from '@minddrop/ui-primitives';

// Option value of the none option
const NONE_VALUE = 'none';

export interface DatabaseComboboxProps
  extends Pick<
    ComboboxProps,
    'variant' | 'valueVariant' | 'size' | 'invalid' | 'placeholder'
  > {
  /**
   * The databases to list. Defaults to every database.
   */
  databases?: Database[];

  /**
   * The ID of the selected database, or null when none is selected.
   */
  value: string | null;

  /**
   * Called with the selected database's ID when the selection
   * changes, or null when the none option is selected.
   */
  onValueChange: (databaseId: string | null) => void;

  /**
   * When true, lists a None option which clears the selection, and
   * shows None in place of the placeholder while nothing is selected.
   */
  allowNone?: boolean;
}

/**
 * Renders a searchable combobox for selecting a database.
 */
export const DatabaseCombobox: FC<DatabaseComboboxProps> = ({
  databases,
  value,
  onValueChange,
  allowNone,
  placeholder,
  ...comboboxProps
}) => {
  const { t } = useTranslation({ keyPrefix: 'databases.combobox' });
  // Get every database
  const allDatabases = Databases.useAll();

  // Build the options
  const items = useMemo(() => {
    // The options, in order
    const options: ComboboxOption[] = [];

    // Add the none option
    if (allowNone) {
      options.push({ value: NONE_VALUE, label: t('none') });
    }

    // Add the listed databases, alphabetically
    (databases ?? allDatabases)
      .map((database) => ({
        value: database.id,
        label: database.name,
        contentIcon: database.icon,
      }))
      .sort((optionA, optionB) => optionA.label.localeCompare(optionB.label))
      .forEach((option) => options.push(option));

    return options;
  }, [databases, allDatabases, allowNone, t]);

  // Resolve the selected database to its option
  const selectedOption = useMemo(
    () => items.find((option) => option.value === value) ?? null,
    [items, value],
  );

  // Pass the selected database's ID to onValueChange
  function handleValueChange(option: ComboboxOption | ComboboxOption[] | null) {
    // Ignore array values. The combobox is single-select, so they never
    // occur.
    if (Array.isArray(option)) {
      return;
    }

    // Pass null for the none option and a cleared value
    if (!option || option.value === NONE_VALUE) {
      onValueChange(null);

      return;
    }

    // Emit the selected database's ID
    onValueChange(option.value);
  }

  return (
    <Combobox
      items={items}
      value={selectedOption}
      placeholder={placeholder ?? t(allowNone ? 'none' : 'placeholder')}
      searchPlaceholder="databases.combobox.searchPlaceholder"
      emptyText={t('empty')}
      onValueChange={handleValueChange}
      {...comboboxProps}
    />
  );
};
