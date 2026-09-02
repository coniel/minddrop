import { useState } from 'react';
import { MarkdownEditor } from '@minddrop/feature-markdown-editor';
import { TagsSelectField } from '@minddrop/ui-tags';
import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import {
  FilePropertySupportedFileExtensions,
  PropertySchema,
  PropertyValue,
} from '@minddrop/properties';
import {
  Button,
  Combobox,
  ContentIcon,
  DateField,
  Group,
  IconButton,
  IconPicker,
  NumberField,
  Select,
  Spacer,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@minddrop/ui-primitives';

export interface DatabaseEntryTemplatePropertyFieldProps {
  /**
   * The schema of the property being filled.
   */
  property: PropertySchema;

  /**
   * The current template value for the property.
   */
  value: PropertyValue | undefined;

  /**
   * The absolute path of a newly picked file for file based
   * properties. Displayed in place of the stored value.
   */
  pickedFilePath?: string;

  /**
   * Callback fired when the value changes. Called with `undefined`
   * when the value is cleared.
   */
  onChange: (value: PropertyValue | undefined) => void;

  /**
   * Callback fired when a file is picked for a file based property.
   */
  onPickFile: (sourcePath: string) => void;
}

/**
 * Renders a single property value field inside the entry template
 * editor form, using the input matching the property's type.
 *
 * Collection properties are not supported: their values are entry ID
 * arrays kept in sync through virtual collections, which cannot be
 * meaningfully persisted in a template.
 */
export const DatabaseEntryTemplatePropertyField: React.FC<
  DatabaseEntryTemplatePropertyFieldProps
> = ({ property, value, pickedFilePath, onChange, onPickFile }) => {
  // Incremented on each clear to remount uncontrolled inputs, which
  // would otherwise keep showing the cleared value
  const [clearCount, setClearCount] = useState(0);

  // Whether the property has a value to clear
  const hasValue = value !== undefined || !!pickedFilePath;

  // Open a file picker and report the picked file
  async function handlePickFile() {
    // Restrict the picker to the property type's supported extensions
    const supportedExtensions =
      property.type === 'image' || property.type === 'file'
        ? FilePropertySupportedFileExtensions[property.type]
        : [];

    // Open the file picker
    const picked = await Fs.openFilePicker({
      multiple: false,
      accept: supportedExtensions.length ? supportedExtensions : undefined,
    });

    // Ignore cancelled picks
    if (typeof picked !== 'string' || !picked) {
      return;
    }

    // Report the picked file
    onPickFile(picked);
  }

  // Clear the property value
  function handleClear() {
    onChange(undefined);
    setClearCount((count) => count + 1);
  }

  return (
    <Stack gap={1} className="database-entry-template-property-field">
      <Group gap={2} className="database-entry-template-property-field-header">
        <ContentIcon color="current-color" icon={property.icon} />
        <Text
          size="sm"
          color="muted"
          className="database-entry-template-property-field-label"
        >
          {property.name}
        </Text>
        <Spacer />
        {hasValue && (
          <Button
            size="sm"
            variant="ghost"
            label="actions.clear"
            onClick={handleClear}
          />
        )}
      </Group>
      {renderField({
        property,
        value,
        pickedFilePath,
        clearCount,
        onChange,
        onPickFile: handlePickFile,
      })}
    </Stack>
  );
};

interface RenderFieldOptions
  extends Pick<
    DatabaseEntryTemplatePropertyFieldProps,
    'property' | 'value' | 'pickedFilePath' | 'onChange'
  > {
  /**
   * Incremented on each clear, remounting uncontrolled inputs so
   * they stop showing the cleared value.
   */
  clearCount: number;

  /**
   * Callback fired when the property's file picker is opened.
   */
  onPickFile: () => void;
}

/**
 * Returns the value input matching the property's type.
 */
function renderField({
  property,
  value,
  pickedFilePath,
  clearCount,
  onChange,
  onPickFile,
}: RenderFieldOptions): React.ReactNode {
  // Placeholder shown when the property has no template value
  const emptyPlaceholder = 'databases.entryTemplates.form.emptyValue' as const;

  // Formatted text properties use a rich text editor, as their
  // values are markdown
  if (property.type === 'formatted-text') {
    return (
      <div className="database-entry-template-property-field-editor">
        <MarkdownEditor
          // The editor is uncontrolled, so remount it when cleared
          key={clearCount}
          initialValue={typeof value === 'string' ? value : ''}
          onDebouncedChange={(markdown) => onChange(markdown)}
        />
      </div>
    );
  }

  // Number properties use a number input
  if (property.type === 'number') {
    return (
      <NumberField
        clearable={false}
        size="md"
        variant="subtle"
        placeholder={emptyPlaceholder}
        value={typeof value === 'number' ? value : null}
        onValueChange={(newValue) => onChange(newValue ?? undefined)}
      />
    );
  }

  // Date properties use a date input
  if (property.type === 'date') {
    return (
      <DateField
        size="md"
        variant="subtle"
        placeholder={emptyPlaceholder}
        value={value instanceof Date ? value : null}
        onValueChange={(date) => onChange(date ?? undefined)}
      />
    );
  }

  // Tags properties use the shared tags picker
  if (property.type === 'tags') {
    return (
      <TagsSelectField
        size="md"
        variant="subtle"
        placeholder={emptyPlaceholder}
        group={property.group}
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
      />
    );
  }

  // Multiselect select properties use a multi value combobox
  if (property.type === 'select' && property.multiselect) {
    return (
      <Combobox
        multiple
        size="md"
        placeholder={i18n.t(emptyPlaceholder)}
        items={property.options.map((option) => ({
          label: option.value,
          value: option.value,
        }))}
        value={Array.isArray(value) ? value : []}
        onValueChange={(newValue: string[]) => onChange(newValue)}
      />
    );
  }

  // Single value select properties use a select
  if (property.type === 'select') {
    return (
      <Select
        size="md"
        variant="subtle"
        placeholder={emptyPlaceholder}
        options={property.options.map((option) => ({
          stringLabel: option.value,
          value: option.value,
        }))}
        value={typeof value === 'string' ? value : undefined}
        onValueChange={onChange}
      />
    );
  }

  // Toggle properties use a switch, remaining unset until first toggled
  if (property.type === 'toggle') {
    return (
      <Switch
        size="md"
        checked={value === true}
        onCheckedChange={(checked) => onChange(checked)}
      />
    );
  }

  // Icon properties use an icon picker
  if (property.type === 'icon') {
    const selectedIcon = typeof value === 'string' && value ? value : undefined;

    return (
      <IconPicker
        closeOnSelect
        onSelect={(icon) => onChange(icon)}
        currentIcon={selectedIcon}
      >
        {selectedIcon ? (
          <IconButton
            size="md"
            variant="subtle"
            color="neutral"
            stringLabel={property.name}
          >
            <ContentIcon color="regular" icon={selectedIcon} />
          </IconButton>
        ) : (
          // A labelled button, so an empty value is not mistaken
          // for a selected icon
          <Button
            size="md"
            variant="subtle"
            label="databases.entryTemplates.form.chooseIcon"
          />
        )}
      </IconPicker>
    );
  }

  // File based properties use a file picker button
  if (property.type === 'image' || property.type === 'file') {
    // The displayed file name: newly picked file first, then stored value
    const fileName = displayFileName(value, pickedFilePath);

    return (
      <Button
        size="md"
        variant="subtle"
        label={
          fileName ? undefined : 'databases.entryTemplates.form.chooseFile'
        }
        onClick={onPickFile}
      >
        {fileName}
      </Button>
    );
  }

  // All other properties are edited as plain text
  return (
    <TextInput
      size="md"
      variant="subtle"
      placeholder={emptyPlaceholder}
      value={typeof value === 'string' ? value : ''}
      onValueChange={(newValue) => onChange(newValue)}
    />
  );
}

/**
 * Returns the file name to display for a file based property,
 * preferring a newly picked file over the stored value.
 */
function displayFileName(
  value: PropertyValue | undefined,
  pickedFilePath: string | undefined,
): string | undefined {
  // A newly picked file takes display priority
  if (pickedFilePath) {
    return Fs.fileNameFromPath(pickedFilePath);
  }

  // Fall back to the stored file name
  if (typeof value === 'string' && value) {
    return value;
  }

  return undefined;
}
