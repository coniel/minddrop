import { open } from '@tauri-apps/plugin-dialog';
import { useState } from 'react';
import { CollectionType, Collections } from '@minddrop/collections';
import { useTranslation } from '@minddrop/i18n';
import {
  Box,
  Button,
  FieldLabel,
  Group,
  HelperText,
  RadioCard,
  RadioGroup,
  Stack,
  TextInput,
} from '@minddrop/ui-elements';
import { mapPropsToClasses, useInputValue } from '@minddrop/utils';
import './CreateCollectionForm.css';
import { PathConflictError } from '@minddrop/file-system';

export interface CreateCollectionFormProps
  extends React.HTMLProps<HTMLDivElement> {
  /**
   * The content of the CreateCollectionForm.
   */
  children?: React.ReactNode;

  /**
   * Callback fired when the cancel button is clicked.
   */
  onCancel?: () => void;
}

export const CreateCollectionForm: React.FC<CreateCollectionFormProps> = ({
  children,
  className,
  onCancel,
  ...other
}) => {
  const { t } = useTranslation({ keyPrefix: 'collections' });
  const { t: tRoot } = useTranslation();
  const [name, setName] = useInputValue('');
  const [itemName, setItemName] = useInputValue('');
  const [selectedDir, setSelectedDir] = useState('');
  const [type, setType] = useState('');
  const [unkownError, setUnknownError] = useState('');
  const [locationError, setLocationError] = useState('');

  async function openDirSelection() {
    // Open a selection dialog for a directory
    const selected = await open({
      multiple: false,
      directory: true,
    });

    if (typeof selected === 'string') {
      // Use selected dir as location
      setSelectedDir(selected);

      // Clear location error message
      setLocationError('');
    }
  }

  function hasValues() {
    return name && itemName && type;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasValues()) {
      return;
    }

    try {
      await Collections.create(selectedDir, {
        name,
        itemName,
        type: type as CollectionType,
      });
    } catch (error) {
      if (error instanceof PathConflictError) {
        setLocationError('error.dirPathConflict');
      } else {
        setUnknownError('error.unknown');
      }
    }
  }

  return (
    <Box
      className={mapPropsToClasses({ className }, 'create-collection-form')}
      {...other}
    >
      {unkownError && <HelperText error>{unkownError}</HelperText>}
      <form onSubmit={handleSubmit}>
        <Group grow align="flex-start">
          <Stack gap="xs">
            <FieldLabel htmlFor="collection-name" label={t('name.label')} />
            <HelperText text={t('name.helperText')} />
            <TextInput
              id="collection-name"
              placeholder={t('name.placeholder')}
              value={name}
              onChange={setName}
            />
          </Stack>

          <Stack gap="xs">
            <FieldLabel htmlFor="item-name" label={t('itemName.label')} />
            <HelperText text={t('itemName.helperText')} />
            <TextInput
              label="Item name"
              placeholder={t('itemName.placeholder')}
              value={itemName}
              onChange={setItemName}
            />
          </Stack>
        </Group>
        <Stack gap="xs" mt="xl">
          <FieldLabel label={t('location.label')} />
          {selectedDir ? (
            <HelperText>
              {t('location.selectedHelperText')}{' '}
              <span className="location">
                {selectedDir}
                {name ? `/${name}` : ''}
              </span>
            </HelperText>
          ) : (
            <HelperText text={t('location.helperText')} />
          )}
          {locationError && <HelperText error text={locationError} />}
          <div>
            <Button
              variant="contained"
              label={t('location.browse')}
              onClick={openDirSelection}
            />
          </div>
        </Stack>
        <RadioGroup value={type} onValueChange={setType}>
          <Stack mt="xl" mb="xl">
            <h3>Collection type</h3>
            <RadioCard
              label="collections.type.notes.label"
              value="notes"
              description="collections.type.notes.description"
            />
            <RadioCard
              label="collections.type.files.label"
              value="files"
              description="collections.type.files.description"
            />
            <RadioCard
              label="collections.type.items.label"
              value="items"
              description="collections.type.items.description"
            />
            <RadioCard
              label="collections.type.weblinks.label"
              value="links"
              description="collections.type.weblinks.description"
            />
            <RadioCard
              label="collections.type.pages.label"
              value="pages"
              description="collections.type.pages.description"
            />
            <RadioCard
              label="collections.type.spaces.label"
              value="spaces"
              description="collections.type.spaces.description"
            />
          </Stack>
        </RadioGroup>
        <Group justify="flex-end">
          {onCancel && (
            <Button variant="text" onClick={onCancel}>
              {tRoot('actions.cancel')}
            </Button>
          )}
          <Button type="submit" variant="primary" disabled={!hasValues()}>
            {t('actions.create')}
          </Button>
        </Group>
      </form>
    </Box>
  );
};
