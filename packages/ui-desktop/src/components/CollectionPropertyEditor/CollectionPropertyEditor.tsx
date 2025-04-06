import { useState } from 'react';
import {
  CollectionPropertySchema,
  CollectionPropertySchemas,
  Collections,
} from '@minddrop/collections';
import { useIcon } from '@minddrop/icons';
import {
  Box,
  Button,
  FieldLabel,
  Group,
  Stack,
  TextInput,
  UserIconPickerButton,
} from '@minddrop/ui-elements';
import { useInputValue } from '@minddrop/utils';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { CheckboxPropertyOptions } from './CheckboxPropertyOptions';

export interface PropertySchemaEditorProps {
  collectionPath: string;
  schema: CollectionPropertySchema;
  onDelete: () => void;
}

export const CollectionPropertyEditor: React.FC<PropertySchemaEditorProps> = ({
  collectionPath,
  schema,
  onDelete,
}) => {
  const [id, setId] = useState(schema.name);
  const [name, setName] = useInputValue(schema.name);
  const [description, setDescription] = useInputValue(schema.description || '');
  const { icon: defaultIcon } = useIcon(
    CollectionPropertySchemas[schema.type].icon,
  );

  function handleDelete() {
    Collections.deleteProperty(collectionPath, id);
    onDelete();
  }

  function handleIconChange(icon: string) {
    Collections.updateProperty(collectionPath, id, {
      icon,
    });
  }

  async function handleBlurName() {
    if (name === id) return;

    await Collections.updateProperty(collectionPath, id, {
      name,
    });

    setId(name);
  }

  function handleBlurDescription() {
    Collections.updateProperty(collectionPath, id, {
      description,
    });
  }

  return (
    <Stack align="stretch">
      <Group gap="xl" align="flex-start">
        <Stack gap="xs">
          <FieldLabel label="Icon" />
          <UserIconPickerButton
            icon={schema.icon}
            defaultIcon={defaultIcon}
            onSelect={handleIconChange}
          />
        </Stack>
        <Stack flex={1} gap="xs">
          <FieldLabel htmlFor="property-name" label="Name" />
          <TextInput
            id="property-name"
            placeholder={`properties.${schema.type}.label`}
            onChange={setName}
            value={name}
            onBlur={handleBlurName}
          />
        </Stack>
      </Group>
      <Stack flex={1} gap="xs">
        <FieldLabel htmlFor="property-description" label="Description" />
        <TextInput
          id="property-description"
          placeholder="labels.optional"
          onChange={setDescription}
          value={description}
          onBlur={handleBlurDescription}
        />
      </Stack>
      {schema.type === 'checkbox' && (
        <CheckboxPropertyOptions
          collectionPath={collectionPath}
          schema={schema}
          name={name}
        />
      )}
      <Box mt="xl">
        <ConfirmationDialog
          danger
          translationPrefix="properties.actions.delete"
          confirmLabel="label"
          description="description"
          title="label"
          onConfirm={handleDelete}
        >
          <Button label="properties.actions.delete.label" variant="danger" />
        </ConfirmationDialog>
      </Box>
    </Stack>
  );
};
