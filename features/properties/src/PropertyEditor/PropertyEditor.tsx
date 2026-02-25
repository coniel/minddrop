import { useState } from 'react';
import { PropertySchema } from '@minddrop/properties';
import {
  Button,
  ContentIcon,
  FieldDefinition,
  FieldRoot,
  Group,
  Icon,
  IconButton,
  IconPicker,
  Text,
  TextInput,
  propsToClass,
  useForm,
  useToggle,
} from '@minddrop/ui-primitives';
import './PropertyEditor.css';

export interface PropertyEditorProps
  extends Omit<React.HTMLProps<HTMLDivElement>, 'property'> {
  /**
   * The property to edit.
   */
  property: PropertySchema;

  /**
   * Called when the user saves the property.
   * @param property The updated property.
   */
  onSave: (property: PropertySchema) => boolean | Promise<boolean>;

  /**
   * Called when the user cancels editing.
   */
  onCancel?: () => void;

  /**
   * Called when the user deletes the property.
   * @param property The deleted property.
   */
  onDelete: (property: PropertySchema) => void;

  /**
   * If true, the editor is open by default.
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * If true, the property can be deleted. If false, the delete button
   * is hidden.
   * @default true
   */
  deletable?: boolean;

  /**
   * Custom validators for the property fields. Only applied to fields
   * present in the editor form.
   */
  validators?: {
    name?: FieldDefinition['validate'];
  };
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({
  className,
  property,
  onSave,
  onCancel,
  onDelete,
  defaultOpen = false,
  deletable = true,
  validators,
  ...other
}) => {
  const [originalIcon] = useState(property.icon);
  const [icon, setIcon] = useState(property.icon);
  const [open, toggleOpen, setOpen] = useToggle(defaultOpen);
  const { fieldProps, values, reset, validateAllAsync } = useForm([
    {
      required: true,
      validateOnBlur: true,
      name: 'name',
      defaultValue: property.name,
      validate: validators?.name,
    },
  ]);

  function handlePickIcon(selectedIcon: string) {
    setIcon(selectedIcon);
  }

  function handleClickCancel() {
    // Reset the form values and icon to their original states
    reset();
    setIcon(originalIcon);

    // Close the editor
    setOpen(false);

    // Call the onCancel callback if provided
    if (onCancel) {
      onCancel();
    }
  }

  async function handleClickSave() {
    // Validate the form fields
    const valid = await validateAllAsync();

    // Keep editor open if validation fails. useForm will display
    // validation errors.
    if (!valid) {
      return;
    }

    // Call provided onSave callback with the updated property values
    const saved = await onSave({
      ...property,
      name: values.name,
      icon,
    });

    // Close the editor if the property was saved successfully
    if (saved) {
      setOpen(false);
    }
  }

  function handleClickDelete() {
    // Call provided onDelete callback
    onDelete(property);
  }

  return (
    <div
      className={propsToClass('property-editor', { className, open })}
      {...other}
    >
      <Group
        role="button"
        className="display"
        onClick={toggleOpen}
        style={{ display: open ? 'none' : 'flex' }}
      >
        <ContentIcon color="muted" icon={property.icon} />
        <Text size="sm" color="muted" className="label" text={property.name} />
        <Icon
          size={14}
          name="chevron-right"
          className="collapsible-indicator"
        />
      </Group>
      <div className="editor" style={{ display: open ? 'flex' : 'none' }}>
        <FieldRoot>
          <Group gap={2}>
            <IconPicker
              closeOnSelect
              onSelect={handlePickIcon}
              currentIcon={icon}
            >
              <IconButton
                size="md"
                variant="subtle"
                color="neutral"
                label="properties.form.icon.label"
              >
                <ContentIcon color="regular" icon={icon} />
              </IconButton>
            </IconPicker>
            <TextInput
              variant="subtle"
              size="md"
              defaultValue={property.name}
              {...fieldProps.name}
            />
          </Group>
        </FieldRoot>
        <Group justify="between" className="footer">
          {deletable && (
            <Button
              size="sm"
              variant="ghost"
              danger="on-hover"
              label="actions.delete"
              onClick={handleClickDelete}
            />
          )}
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
