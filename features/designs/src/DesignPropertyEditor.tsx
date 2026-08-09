import { useState } from 'react';
import { Events, OpenConfirmationDialogEvent } from '@minddrop/events';
import { PropertyEditorBase } from '@minddrop/feature-properties';
import { TranslationKey, createI18nKeyBuilder } from '@minddrop/i18n';
import { PropertySchema, PropertyType } from '@minddrop/properties';
import { InputLabel, Stack, Text, TextField } from '@minddrop/ui-primitives';
import {
  DesignStudioStore,
  addDesignProperty,
  removeDesignProperty,
  renameDesignProperty,
  updateDesignProperty,
} from './DesignStudioStore';
import { DatePlaceholderField } from './design-elements/date/DatePlaceholderField';
import { IconPlaceholderField } from './design-elements/icon/IconPlaceholderField';
import { NumberPlaceholderField } from './design-elements/number/NumberPlaceholderField';
import { PlaceholderImageField } from './style-editors/PlaceholderImageField';
import { SelectPlaceholderField } from './style-editors/SelectPlaceholderField';
import { TextPlaceholderField } from './style-editors/TextPlaceholderField';

// Property types that support a placeholder
const PLACEHOLDER_PROPERTY_TYPES: PropertyType[] = [
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

// Larger lorem ipsum steps for formatted text placeholders
const formattedTextWordCounts = [
  5, 10, 20, 30, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900,
  1000,
];

export interface DesignPropertyEditorProps {
  /**
   * The property to edit.
   */
  property: PropertySchema;

  /**
   * Whether the property is a draft that has not yet been added
   * to the design.
   * @default false
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
   * Props to spread on the drag handle for sortable list integration.
   */
  dragHandleProps?: Record<string, unknown>;
}

/**
 * Renders a property editor for a design property, adding a
 * placeholder field for text-rendering property types.
 */
export const DesignPropertyEditor: React.FC<DesignPropertyEditorProps> = ({
  property,
  isDraft = false,
  onSaveDraft,
  onCancelDraft,
  dragHandleProps,
}) => {
  const [placeholder, setPlaceholder] = useState(property.placeholder || '');
  const [resetCount, setResetCount] = useState(0);

  function validateName(name: string): TranslationKey | undefined {
    const i18nKey = createI18nKeyBuilder('properties.form.name.validation.');

    // Name has not changed and is therefore valid
    if (!isDraft && name === property.name) {
      return;
    }

    // Name is required
    if (name.trim() === '') {
      return i18nKey('required');
    }

    // Check for name conflicts within the design
    const design = DesignStudioStore.getDesign();
    const conflicting = design?.properties.find(
      (existing) => existing.name === name,
    );

    if (conflicting) {
      return i18nKey('nameConflict');
    }

    // Check for invalid characters
    if (!/^[a-zA-Z_][a-zA-Z0-9_ -]*$/.test(name)) {
      return i18nKey('invalidCharacters');
    }
  }

  // Discard the unsaved placeholder value, remounting the
  // placeholder field to reset its internal state
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

    if (isDraft) {
      await addDesignProperty(propertyWithPlaceholder);

      if (onSaveDraft) {
        onSaveDraft();
      }

      return true;
    }

    // Apply non-name updates under the current name first, then
    // apply the rename
    await updateDesignProperty({
      ...propertyWithPlaceholder,
      name: property.name,
    });

    if (updatedProperty.name !== property.name) {
      await renameDesignProperty(property.name, updatedProperty.name);
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
        removeDesignProperty(propertyToDelete.name);
      },
    });
  }

  const hasPlaceholder = PLACEHOLDER_PROPERTY_TYPES.includes(property.type);

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
 * Renders the placeholder field appropriate for the property type.
 */
const PlaceholderField: React.FC<PlaceholderFieldProps> = ({
  type,
  value,
  onValueChange,
}) => {
  if (type === 'text' || type === 'title') {
    return <TextPlaceholderField value={value} onValueChange={onValueChange} />;
  }

  if (type === 'formatted-text') {
    return (
      <TextPlaceholderField
        value={value}
        onValueChange={onValueChange}
        wordCounts={formattedTextWordCounts}
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
        onRemove={() => onValueChange('')}
      />
    );
  }

  if (type === 'icon') {
    return <IconPlaceholderField value={value} onValueChange={onValueChange} />;
  }

  return null;
};
