import { useEffect, useRef, useState } from 'react';
import { DatabaseEntryTemplate, Databases } from '@minddrop/databases';
import {
  Events,
  OpenConfirmationDialogEvent,
  OpenConfirmationDialogEventData,
} from '@minddrop/events';
import { Properties, PropertyMap, PropertyValue } from '@minddrop/properties';
import {
  Button,
  FieldError,
  FieldLabel,
  FieldRoot,
  Group,
  Icon,
  Spacer,
  Text,
  TextInput,
  propsToClass,
  useForm,
  useToggle,
} from '@minddrop/ui-primitives';
import { DatabaseEntryTemplatePropertyField } from './DatabaseEntryTemplatePropertyField';
import './DatabaseEntryTemplateEditor.css';

export interface DatabaseEntryTemplateEditorProps {
  /**
   * The ID of the database to which the template belongs.
   */
  databaseId: string;

  /**
   * The template to edit. Drafts receive a synthesized template
   * with an empty ID.
   */
  template: DatabaseEntryTemplate;

  /**
   * Whether the template is a draft.
   * Draft templates are new templates that have not yet been saved.
   * @default false
   */
  isDraft?: boolean;

  /**
   * Callback fired when a draft template is saved.
   */
  onSaveDraft?: () => void;

  /**
   * Callback fired when a draft template is cancelled.
   */
  onCancelDraft?: () => void;

  /**
   * Props to spread on the drag handle for sortable list integration.
   */
  dragHandleProps?: Record<string, unknown>;
}

// Property types excluded from the template form. Timestamp values
// are set automatically at creation time, title values are covered
// by the default entry title field, and collection values are kept
// in sync through virtual collections which cannot be meaningfully
// persisted in a template.
const ExcludedPropertyTypes = [
  'created',
  'last-modified',
  'title',
  'collection',
];

/**
 * Renders a collapsible editor for a database entry template with a
 * value field for each of the database's fillable properties.
 */
export const DatabaseEntryTemplateEditor: React.FC<
  DatabaseEntryTemplateEditorProps
> = ({
  databaseId,
  template,
  isDraft = false,
  onSaveDraft,
  onCancelDraft,
  dragHandleProps,
}) => {
  const wasDraggingRef = useRef(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<PropertyMap>(template.properties);
  const [pickedFiles, setPickedFiles] = useState<Record<string, string>>({});
  const [open, , setOpen] = useToggle(isDraft);
  const databaseConfig = Databases.use(databaseId);

  const {
    fieldProps,
    values: formValues,
    reset,
    validateAllAsync,
  } = useForm([
    {
      // Not validated on blur: the error message changes the form's
      // height, moving the footer buttons out from under the cursor
      required: true,
      name: 'name',
      defaultValue: template.name,
      validate: validateName,
    },
    {
      name: 'defaultTitle',
      defaultValue: template.defaultTitle ?? '',
    },
  ]);

  // Properties fillable via the template form
  const fillableProperties =
    databaseConfig?.properties.filter(
      (property) => !ExcludedPropertyTypes.includes(property.type),
    ) ?? [];

  // Whether the template has files stored alongside it, which are
  // deleted with it. Based on the persisted values, as values still
  // being edited have no stored file yet.
  const hasStoredFiles = (databaseConfig?.properties ?? []).some(
    (property) =>
      Properties.isFileBased(property) && !!template.properties[property.name],
  );

  // Focus the name field when opening a template without a name
  useEffect(() => {
    if (!open) {
      return;
    }

    if (!template.name) {
      nameInputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on open
  }, [open]);

  // Wrap drag handle props to track drag interactions and
  // prevent the click handler from opening the editor
  const resolvedDragHandleProps = dragHandleProps
    ? {
        ...dragHandleProps,
        onPointerDown: (event: React.PointerEvent) => {
          wasDraggingRef.current = true;

          if (
            dragHandleProps.onPointerDown &&
            typeof dragHandleProps.onPointerDown === 'function'
          ) {
            (
              dragHandleProps.onPointerDown as (
                event: React.PointerEvent,
              ) => void
            )(event);
          }
        },
      }
    : undefined;

  function handleOpen() {
    // Suppress open if a drag interaction just occurred
    if (wasDraggingRef.current) {
      wasDraggingRef.current = false;

      return;
    }

    setOpen(true);
  }

  // Set a property's template value
  function handleChangeValue(
    propertyName: string,
    value: PropertyValue | undefined,
  ) {
    setValues((previousValues) => {
      const updatedValues = { ...previousValues };

      // Clearing removes the value entirely
      if (value === undefined) {
        delete updatedValues[propertyName];
      } else {
        updatedValues[propertyName] = value;
      }

      return updatedValues;
    });

    // Clearing a value also drops any newly picked file
    if (value === undefined) {
      setPickedFiles((previousFiles) => {
        const updatedFiles = { ...previousFiles };

        delete updatedFiles[propertyName];

        return updatedFiles;
      });
    }
  }

  // Stage a picked file for a file based property
  function handlePickFile(propertyName: string, sourcePath: string) {
    setPickedFiles((previousFiles) => ({
      ...previousFiles,
      [propertyName]: sourcePath,
    }));
  }

  function handleClickCancel() {
    // Reset the form and property values to their original states
    reset();
    setValues(template.properties);
    setPickedFiles({});

    // Close the editor
    setOpen(false);

    // Call the onCancelDraft callback if provided
    if (onCancelDraft) {
      onCancelDraft();
    }
  }

  async function handleClickSave() {
    // Validate the form fields
    const valid = await validateAllAsync();

    // Keep the editor open if validation fails. useForm will
    // display validation errors.
    if (!valid) {
      return;
    }

    // The updated template data
    const data = {
      name: formValues.name,
      defaultTitle: formValues.defaultTitle || undefined,
      properties: values,
    };

    if (isDraft) {
      // Persist the draft as a new template
      await Databases.addEntryTemplate(databaseId, data, pickedFiles);

      // Remove the draft from the panel's draft list
      if (onSaveDraft) {
        onSaveDraft();
      }

      return;
    }

    // Persist the updated template
    await Databases.updateEntryTemplate(
      databaseId,
      template.id,
      data,
      pickedFiles,
    );

    // Clear staged files and close the editor
    setPickedFiles({});
    setOpen(false);
  }

  function handleClickDelete() {
    const i18nRoot = 'databases.entryTemplates.actions.delete.confirmation';

    // Only mention stored files when the template actually has some
    const message = hasStoredFiles
      ? `${i18nRoot}.messageWithFiles`
      : `${i18nRoot}.message`;

    // Confirm the deletion before removing the template
    Events.dispatch<OpenConfirmationDialogEventData>(
      OpenConfirmationDialogEvent,
      {
        title: `${i18nRoot}.title`,
        message,
        confirmLabel: `${i18nRoot}.confirm`,
        danger: true,
        onConfirm: () => {
          Databases.removeEntryTemplate(databaseId, template.id);
        },
      },
    );
  }

  return (
    <div className={propsToClass('database-entry-template-editor', { open })}>
      <Group
        role="button"
        className="database-entry-template-editor-display"
        onClick={handleOpen}
        style={{ display: open ? 'none' : 'flex' }}
      >
        <Icon
          size={14}
          name="grip-vertical"
          color="current-color"
          className="database-entry-template-editor-drag-handle"
          {...resolvedDragHandleProps}
        />
        <Text
          size="sm"
          color="inherit"
          className="database-entry-template-editor-label"
        >
          {template.name}
        </Text>
        <Icon
          size={14}
          name="chevron-right"
          className="collapsible-indicator"
          color="current-color"
        />
      </Group>
      <div
        className="database-entry-template-editor-form"
        style={{ display: open ? 'flex' : 'none' }}
      >
        <FieldRoot invalid={!!fieldProps.name.error}>
          <FieldLabel
            size="sm"
            label="databases.entryTemplates.form.name.label"
          />
          <TextInput
            ref={nameInputRef}
            variant="subtle"
            size="md"
            defaultValue={template.name}
            {...fieldProps.name}
          />
          <FieldError error={fieldProps.name.error} />
        </FieldRoot>
        <FieldRoot>
          <FieldLabel
            size="sm"
            label="databases.entryTemplates.form.defaultTitle.label"
          />
          <TextInput
            variant="subtle"
            size="md"
            placeholder="databases.entryTemplates.form.defaultTitle.placeholder"
            defaultValue={template.defaultTitle ?? ''}
            {...fieldProps.defaultTitle}
          />
        </FieldRoot>
        {/* Value fields for each fillable property */}
        <div className="database-entry-template-editor-fields">
          {fillableProperties.map((property) => (
            <DatabaseEntryTemplatePropertyField
              // Keyed on the open state so uncontrolled inputs, such
              // as the rich text editor, are remounted when the
              // editor reopens rather than keeping cancelled edits
              key={`${property.name}:${open}`}
              property={property}
              value={values[property.name]}
              pickedFilePath={pickedFiles[property.name]}
              onChange={(value) => handleChangeValue(property.name, value)}
              onPickFile={(sourcePath) =>
                handlePickFile(property.name, sourcePath)
              }
            />
          ))}
        </div>
        <Group className="database-entry-template-editor-footer">
          {!isDraft && (
            <Button
              size="sm"
              variant="ghost"
              danger="on-hover"
              label="actions.delete"
              onClick={handleClickDelete}
            />
          )}
          {/* Keeps the cancel and save buttons right aligned when
              there is no delete button */}
          <Spacer />
          <div>
            <Button
              label="actions.cancel"
              size="sm"
              variant="ghost"
              onClick={handleClickCancel}
            />
            <Button
              label="actions.save"
              size="sm"
              variant="ghost"
              color="primary"
              onClick={handleClickSave}
            />
          </div>
        </Group>
      </div>
    </div>
  );
};

/**
 * Validates the template name, returning the i18n key of the
 * validation error if invalid.
 */
function validateName(name: string): string | undefined {
  // Name is required
  if (name.trim() === '') {
    return 'databases.entryTemplates.form.name.validation.required';
  }
}
