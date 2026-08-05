import { useMemo, useState } from 'react';
import { Collections } from '@minddrop/collections';
import { UiIconName } from '@minddrop/ui-icons';
import {
  Button,
  Group,
  Icon,
  InputLabel,
  Select,
  Stack,
  Subheading,
  TextField,
} from '@minddrop/ui-primitives';
import { useForm } from '@minddrop/utils';
import { DataView, DataViewTypes, DataViews } from '@minddrop/views';
import './CreateDataViewForm.css';

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
 * Renders a data view creation form: a name field and a
 * collection data source select. The view is only created once
 * the form is submitted.
 */
export const CreateDataViewForm: React.FC<CreateDataViewFormProps> = ({
  viewType,
  onCreateView,
}) => {
  const [collectionId, setCollectionId] = useState<string | undefined>();
  const viewTypeConfig = DataViewTypes.use(viewType);
  const collections = Collections.useAll();
  const { fieldProps, validateAllAsync, values } = useForm([
    { name: 'name', required: true },
  ]);

  // Only real collections can be view sources
  const realCollections = useMemo(
    () => collections.filter((collection) => !collection.virtual),
    [collections],
  );

  async function handleCreate() {
    // The data source is required
    if (!collectionId) {
      return;
    }

    // Validate the name field
    if (!(await validateAllAsync())) {
      return;
    }

    // Create the view
    const view = await DataViews.create(
      viewType,
      { type: 'collection', id: collectionId },
      values.name,
    );

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
        label="views.form.name.label"
        placeholder="views.form.name.placeholder"
        {...fieldProps.name}
      />
      <Stack gap={1}>
        <InputLabel label="views.form.source.label" />
        <Select
          size="lg"
          placeholder="views.form.source.placeholder"
          options={realCollections.map((collection) => ({
            value: collection.id,
            stringLabel: collection.name,
          }))}
          value={collectionId}
          onValueChange={setCollectionId}
        />
      </Stack>
      <Button
        label="views.form.actions.create"
        variant="solid"
        color="primary"
        disabled={!collectionId}
        onClick={handleCreate}
      />
    </Stack>
  );
};
