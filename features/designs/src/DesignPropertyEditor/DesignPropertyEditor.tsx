import { useState } from 'react';
import { Events, OpenConfirmationDialogEvent } from '@minddrop/events';
import { PropertyEditorBase } from '@minddrop/feature-properties';
import { TranslationKey, createI18nKeyBuilder } from '@minddrop/i18n';
import { PropertySchema, PropertyType } from '@minddrop/properties';
import { InputLabel, Stack, Text, TextField } from '@minddrop/ui-primitives';
import { useDesignStudio } from '../DesignStudioStore';
import { DatePlaceholderField } from '../style-editors/DatePlaceholderField';
import { IconPickerField } from '../style-editors/IconPickerField';
import { NumberPlaceholderField } from '../style-editors/NumberPlaceholderField';
import { PlaceholderImageField } from '../style-editors/PlaceholderImageField';
import { SelectPlaceholderField } from '../style-editors/SelectPlaceholderField';
import { TextPlaceholderField } from '../style-editors/TextPlaceholderField';

// The property types whose placeholder can be authored
const PlaceholderPropertyTypes: PropertyType[] = [
  'text',
  'title',
  'formatted-text',
  'number',
  'date',
  'select',
  'url',
  'image',
  'icon',
];

// Coarser length steps for formatted text, which runs to whole
// paragraphs rather than a line
const FormattedTextWordCounts = [
  5, 10, 20, 30, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900,
  1000,
];

const nameValidationKey = createI18nKeyBuilder(
  'properties.form.name.validation.',
);

export interface DesignPropertyEditorProps {
  /**
   * The property to edit.
   */
  property: PropertySchema;

  /**
   * Whether the property is a draft not yet added to the design.
   */
  isDraft?: boolean;

  /**
   * Callback fired when a draft property is saved.
   */
  onSaveDraft?: () => void;

  /**
   * Callback fired when a draft property is cancelled.
   */
  onCancelDraft?: () => void;

  /**
   * Props spread on the drag handle for sortable list integration.
   */
  dragHandleProps?: Record<string, unknown>;
}

/**
 * Renders the editor for a design property, extending the shared
 * property editor with the placeholder field its type calls for.
 * Placeholders live on the property so every element bound to it
 * renders the same stand-in value.
 */
export const DesignPropertyEditor: React.FC<DesignPropertyEditorProps> = ({
  property,
  isDraft = false,
  onSaveDraft,
  onCancelDraft,
  dragHandleProps,
}) => {
  const studio = useDesignStudio();
  const [placeholder, setPlaceholder] = useState(property.placeholder || '');
  // Bumped to remount the placeholder field, discarding the state
  // it holds internally
  const [resetCount, setResetCount] = useState(0);

  function validateName(name: string): TranslationKey | undefined {
    // An unchanged name is always valid
    if (!isDraft && name === property.name) {
      return;
    }

    if (name.trim() === '') {
      return nameValidationKey('required');
    }

    // Names address properties, so they must be unique
    if (studio.getDesignProperty(name)) {
      return nameValidationKey('nameConflict');
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_ -]*$/.test(name)) {
      return nameValidationKey('invalidCharacters');
    }
  }

  // Discard the unsaved placeholder, remounting the field so its
  // internal state resets with it
  function handleCancel() {
    setPlaceholder(property.placeholder || '');
    setResetCount((current) => current + 1);

    if (onCancelDraft) {
      onCancelDraft();
    }
  }

  async function handleSave(updatedProperty: PropertySchema) {
    const propertyWithPlaceholder = {
      ...updatedProperty,
      placeholder: placeholder || undefined,
    };

    // A draft becomes a real property on its first save
    if (isDraft) {
      await studio.addDesignProperty(propertyWithPlaceholder);

      if (onSaveDraft) {
        onSaveDraft();
      }

      return true;
    }

    // Apply the other edits under the existing name first, since
    // the update matches the property by name
    await studio.updateDesignProperty({
      ...propertyWithPlaceholder,
      name: property.name,
    });

    // Then apply the rename, which remaps element bindings
    if (updatedProperty.name !== property.name) {
      await studio.renameDesignProperty(property.name, updatedProperty.name);
    }

    return true;
  }

  function handleDelete(propertyToDelete: PropertySchema) {
    const i18nRoot = 'designs.properties.actions.delete.confirmation';

    Events.dispatch(OpenConfirmationDialogEvent, {
      title: `${i18nRoot}.title`,
      message: `${i18nRoot}.message`,
      confirmLabel: `${i18nRoot}.confirm`,
      danger: true,
      onConfirm: () => {
        studio.removeDesignProperty(propertyToDelete.name);
      },
    });
  }

  const hasPlaceholder = PlaceholderPropertyTypes.includes(property.type);

  return (
    <PropertyEditorBase
      defaultOpen={isDraft}
      deletable={!isDraft}
      property={property}
      validators={{ name: validateName }}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
      dragHandleProps={dragHandleProps}
    >
      {hasPlaceholder && (
        <Stack gap={1}>
          <InputLabel size="xs" label="designs.placeholder.label" />
          {property.type === 'select' && (
            <Text
              block
              size="xs"
              color="muted"
              text="designs.select.placeholder.description"
            />
          )}
          <PlaceholderField
            key={resetCount}
            type={property.type}
            value={placeholder}
            onValueChange={setPlaceholder}
          />
        </Stack>
      )}
    </PropertyEditorBase>
  );
};

interface PlaceholderFieldProps {
  /**
   * The property type the placeholder belongs to.
   */
  type: PropertyType;

  /**
   * The placeholder value.
   */
  value: string;

  /**
   * Callback fired when the placeholder value changes.
   */
  onValueChange: (value: string) => void;
}

/**
 * Renders the placeholder input matching the property type.
 */
const PlaceholderField: React.FC<PlaceholderFieldProps> = ({
  type,
  value,
  onValueChange,
}) => {
  function handleClear() {
    onValueChange('');
  }

  if (type === 'text' || type === 'title') {
    return <TextPlaceholderField value={value} onValueChange={onValueChange} />;
  }

  if (type === 'formatted-text') {
    return (
      <TextPlaceholderField
        value={value}
        onValueChange={onValueChange}
        wordCounts={FormattedTextWordCounts}
      />
    );
  }

  if (type === 'number') {
    return (
      <NumberPlaceholderField value={value} onValueChange={onValueChange} />
    );
  }

  if (type === 'date') {
    return <DatePlaceholderField value={value} onValueChange={onValueChange} />;
  }

  if (type === 'select') {
    return (
      <SelectPlaceholderField value={value} onValueChange={onValueChange} />
    );
  }

  if (type === 'url') {
    return (
      <TextField
        variant="subtle"
        size="md"
        value={value}
        onValueChange={onValueChange}
        placeholder="designs.placeholder.placeholder"
      />
    );
  }

  if (type === 'image') {
    return (
      <PlaceholderImageField
        image={value}
        onSelect={onValueChange}
        onRemove={handleClear}
      />
    );
  }

  if (type === 'icon') {
    return (
      <IconPickerField
        value={value}
        onSelect={onValueChange}
        onClear={handleClear}
      />
    );
  }

  return null;
};
