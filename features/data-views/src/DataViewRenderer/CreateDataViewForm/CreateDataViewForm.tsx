import { useState } from 'react';
import { Collections } from '@minddrop/collections';
import {
  DataView,
  DataViewTypes,
  DataViews,
  ViewDataSource,
} from '@minddrop/data-views';
import { TranslationKey } from '@minddrop/i18n';
import { Queries } from '@minddrop/queries';
import {
  DataSourceCombobox,
  DataSourceSelection,
} from '@minddrop/ui-components';
import { UiIconName } from '@minddrop/ui-icons';
import {
  Button,
  Group,
  Icon,
  InputLabel,
  Stack,
  Subheading,
  TextField,
} from '@minddrop/ui-primitives';
import { useForm } from '@minddrop/utils';
import './CreateDataViewForm.css';

// Default data source selection when collections are supported
const NEW_COLLECTION_SELECTION: DataSourceSelection = {
  type: 'new-collection',
};

export interface CreateDataViewFormProps {
  /**
   * The type of view to create.
   */
  viewType: string;

  /**
   * Called with the newly created view after the form is
   * submitted.
   */
  onCreateView?: (view: DataView) => void;
}

/**
 * Renders a data view creation form: a name field and a data
 * source combobox. New data sources staged in the combobox are
 * only created once the form is submitted.
 */
export const CreateDataViewForm: React.FC<CreateDataViewFormProps> = ({
  viewType,
  onCreateView,
}) => {
  const viewTypeConfig = DataViewTypes.use(viewType);

  // Data source types supported by the view type
  const supportedDataSources = viewTypeConfig?.supportedDataSources ?? [];
  const supportsCollections = supportedDataSources.includes('collection');
  const supportsQueries = supportedDataSources.includes('query');

  // Default to creating a new collection when supported
  const defaultSelection = supportsCollections
    ? NEW_COLLECTION_SELECTION
    : null;

  const [dataSource, setDataSource] = useState<DataSourceSelection | null>(
    defaultSelection,
  );
  const { fieldProps, validateAllAsync, values } = useForm([
    { name: 'name', required: true },
    { name: 'sourceName' },
  ]);

  // Whether the selected data source is a staged new source
  const isNewSource =
    dataSource?.type === 'new-collection' || dataSource?.type === 'new-query';

  async function handleCreate() {
    // The data source is required
    if (!dataSource) {
      return;
    }

    // Validate the name field
    if (!(await validateAllAsync())) {
      return;
    }

    // Resolve the selection to a data source, creating staged
    // new sources only after validation has passed. New sources
    // fall back to the view name when no name is given.
    const source = await resolveDataSource(
      dataSource,
      values.sourceName || values.name,
    );

    // Create the view
    const view = await DataViews.create(viewType, source, values.name);

    onCreateView?.(view);
  }

  return (
    <Stack className="create-data-view-form" gap={3}>
      {/* Header showing the type of view being created */}
      {viewTypeConfig && (
        <Group gap={2} align="center">
          <Icon name={(viewTypeConfig.icon as UiIconName) || 'app-window'} />
          <Subheading noMargin size="lg" text={viewTypeConfig.name} />
        </Group>
      )}
      <TextField
        variant="filled"
        label="dataViews.form.name.label"
        placeholder="dataViews.form.name.placeholder"
        {...fieldProps.name}
      />
      <Stack gap={1}>
        <InputLabel label="dataViews.form.source.label" />
        <DataSourceCombobox
          size="lg"
          valueVariant="text"
          supportedDataSources={supportedDataSources}
          showNewCollectionOption={supportsCollections}
          showNewQueryOption={supportsQueries}
          defaultSelection={defaultSelection ?? undefined}
          onSelectionChange={setDataSource}
        />
      </Stack>
      {/* Name field for the staged new data source */}
      {isNewSource && (
        <TextField
          variant="filled"
          label={sourceNameLabel(dataSource.type)}
          {...fieldProps.sourceName}
        />
      )}
      <Button
        label="dataViews.form.actions.create"
        variant="solid"
        color="primary"
        disabled={!dataSource}
        onClick={handleCreate}
      />
    </Stack>
  );
};

/**
 * Returns the source name field label for a staged new data
 * source type.
 */
function sourceNameLabel(type: 'new-collection' | 'new-query'): TranslationKey {
  // New collections use the collection name label
  if (type === 'new-collection') {
    return 'dataViews.form.source.collectionName.label';
  }

  return 'dataViews.form.source.queryName.label';
}

/**
 * Resolves a data source selection to a view data source,
 * creating staged new collections and queries named after the
 * view.
 */
async function resolveDataSource(
  selection: DataSourceSelection,
  viewName: string,
): Promise<ViewDataSource> {
  // Create the staged new collection
  if (selection.type === 'new-collection') {
    const collection = await Collections.create(viewName);

    return { type: 'collection', id: collection.id };
  }

  // Create the staged new query
  if (selection.type === 'new-query') {
    const query = await Queries.create(viewName);

    return { type: 'query', id: query.id };
  }

  return selection;
}
