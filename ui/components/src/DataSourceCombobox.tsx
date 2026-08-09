import { FC, useMemo } from 'react';
import { Collections } from '@minddrop/collections';
import { ViewDataSource, ViewDataSourceType } from '@minddrop/data-views';
import { Databases } from '@minddrop/databases';
import { useTranslation } from '@minddrop/i18n';
import { Queries } from '@minddrop/queries';
import {
  Combobox,
  ComboboxOption,
  ComboboxOptionGroup,
  ComboboxProps,
} from '@minddrop/ui-primitives';
import { DATABASE_FALLBACK_ICON } from './constants';

// Option values for the create new data source options
const NEW_COLLECTION_VALUE = 'new-collection';
const NEW_QUERY_VALUE = 'new-query';

export type DataSourceSelection =
  | ViewDataSource
  | { type: 'new-collection' }
  | { type: 'new-query' };

export interface DataSourceComboboxProps
  extends Pick<ComboboxProps, 'variant' | 'valueVariant' | 'size' | 'invalid'> {
  /**
   * The data source types available for selection. Data sources
   * of other types are not listed.
   */
  supportedDataSources: ViewDataSourceType[];

  /**
   * When true, lists a "New collection" option in the New group
   * at the top.
   */
  showNewCollectionOption?: boolean;

  /**
   * When true, lists a "New query" option in the New group at
   * the top.
   */
  showNewQueryOption?: boolean;

  /**
   * The initially selected data source. Must correspond to a
   * listed option.
   */
  defaultSelection?: DataSourceSelection;

  /**
   * Called with the selected data source when the selection
   * changes, or null when the selection is cleared.
   */
  onSelectionChange?: (selection: DataSourceSelection | null) => void;
}

/**
 * Renders a searchable combobox for selecting a data view data
 * source, grouping the available sources by type.
 */
export const DataSourceCombobox: FC<DataSourceComboboxProps> = ({
  supportedDataSources,
  showNewCollectionOption,
  showNewQueryOption,
  defaultSelection,
  onSelectionChange,
  ...comboboxProps
}) => {
  const { t } = useTranslation({ keyPrefix: 'dataViews.dataSource' });
  const collections = Collections.useAll();
  const queries = Queries.useAll();
  const databases = Databases.useAll();

  // Build the grouped options along with a map of option values
  // to their data source selections
  const { groups, selections } = useMemo(() => {
    const optionGroups: ComboboxOptionGroup[] = [];
    const selectionMap = new Map<string, DataSourceSelection>();

    // New data source options, controlled by the show props
    const newOptions: ComboboxOption[] = [];

    // Add the new collection option
    if (showNewCollectionOption) {
      newOptions.push({
        value: NEW_COLLECTION_VALUE,
        label: t('newCollection'),
        icon: 'library',
      });
      selectionMap.set(NEW_COLLECTION_VALUE, { type: 'new-collection' });
    }

    // Add the new query option
    if (showNewQueryOption) {
      newOptions.push({
        value: NEW_QUERY_VALUE,
        label: t('newQuery'),
        icon: 'list-filter',
      });
      selectionMap.set(NEW_QUERY_VALUE, { type: 'new-query' });
    }

    // Add the new options group when it has options
    if (newOptions.length) {
      optionGroups.push({
        value: 'new',
        label: 'dataViews.dataSource.groups.new',
        items: newOptions,
      });
    }

    // Add the collections group when collections are supported.
    // Virtual collections are in-memory only and cannot be
    // referenced as data sources.
    if (supportedDataSources.includes('collection')) {
      const options: ComboboxOption[] = [];

      collections
        .filter((collection) => !collection.virtual)
        .forEach((collection) => {
          options.push({
            value: collection.id,
            label: collection.name,
            icon: 'library',
          });
          selectionMap.set(collection.id, {
            type: 'collection',
            id: collection.id,
          });
        });

      // Skip the group when there are no collections
      if (options.length) {
        optionGroups.push({
          value: 'collections',
          label: 'dataViews.dataSource.groups.collections',
          items: sortOptions(options),
        });
      }
    }

    // Add the queries group when queries are supported
    if (supportedDataSources.includes('query')) {
      const options: ComboboxOption[] = [];

      queries.forEach((query) => {
        options.push({
          value: query.id,
          label: query.name,
          icon: 'list-filter',
        });
        selectionMap.set(query.id, { type: 'query', id: query.id });
      });

      // Skip the group when there are no queries
      if (options.length) {
        optionGroups.push({
          value: 'queries',
          label: 'dataViews.dataSource.groups.queries',
          items: sortOptions(options),
        });
      }
    }

    // Add the databases group when databases are supported
    if (supportedDataSources.includes('database')) {
      const options: ComboboxOption[] = [];

      databases.forEach((database) => {
        options.push({
          value: database.id,
          label: database.name,
          contentIcon: database.icon || DATABASE_FALLBACK_ICON,
        });
        selectionMap.set(database.id, { type: 'database', id: database.id });
      });

      // Skip the group when there are no databases
      if (options.length) {
        optionGroups.push({
          value: 'databases',
          label: 'dataViews.dataSource.groups.databases',
          items: sortOptions(options),
        });
      }
    }

    return { groups: optionGroups, selections: selectionMap };
  }, [
    collections,
    queries,
    databases,
    supportedDataSources,
    showNewCollectionOption,
    showNewQueryOption,
    t,
  ]);

  // Resolve the default selection to its combobox option
  const defaultOption = useMemo(() => {
    // No default selection, nothing to resolve
    if (!defaultSelection) {
      return undefined;
    }

    const value = selectionValue(defaultSelection);

    return groups
      .flatMap((group) => group.items)
      .find((option) => option.value === value);
  }, [defaultSelection, groups]);

  // Report the selected option's data source selection
  function handleValueChange(value: ComboboxOption | ComboboxOption[] | null) {
    // The combobox is single-select, multi values never occur
    if (Array.isArray(value)) {
      return;
    }

    // Clear the selection when the value is cleared
    if (!value) {
      onSelectionChange?.(null);

      return;
    }

    onSelectionChange?.(selections.get(value.value) ?? null);
  }

  return (
    <Combobox
      groups={groups}
      defaultValue={defaultOption}
      placeholder={t('placeholder')}
      searchPlaceholder="dataViews.dataSource.searchPlaceholder"
      emptyText={t('empty')}
      onValueChange={handleValueChange}
      {...comboboxProps}
    />
  );
};

/**
 * Sorts combobox options alphabetically by label.
 */
function sortOptions(options: ComboboxOption[]): ComboboxOption[] {
  return options.sort((optionA, optionB) =>
    optionA.label.localeCompare(optionB.label),
  );
}

/**
 * Returns the combobox option value for a data source selection.
 */
function selectionValue(selection: DataSourceSelection): string {
  // New collection options use a fixed value
  if (selection.type === 'new-collection') {
    return NEW_COLLECTION_VALUE;
  }

  // New query options use a fixed value
  if (selection.type === 'new-query') {
    return NEW_QUERY_VALUE;
  }

  return selection.id;
}
