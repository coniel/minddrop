import {
  Button,
  ContentIcon,
  FieldDefinition,
  Icon,
  IconButton,
  IconPicker,
  Text,
  TextField,
  mapPropsToClasses,
  useForm,
  useToggle,
} from '@minddrop/ui-primitives';
import './PropertyEditor.css';
import { useState } from 'react';
import { PropertySchema } from '@minddrop/properties';

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
      className={mapPropsToClasses({ className, open }, 'property-editor')}
      {...other}
    >
      <div
        role="button"
        className="display"
        onClick={toggleOpen}
        style={{ display: open ? 'none' : 'flex' }}
      >
        <ContentIcon icon={property.icon} />

        <Text size="small" color="inherit" weight="inherit" className="label">
          {property.name}
        </Text>

        <Icon
          size={14}
          name="chevron-right"
          className="collapsible-indicator"
        />
      </div>
      <div className="editor" style={{ display: open ? 'flex' : 'none' }}>
        <TextField
          label="properties.form.name.label"
          variant="filled"
          defaultValue={property.name}
          iconPicker={
            <IconPicker
              closeOnSelect
              onSelect={handlePickIcon}
              currentIcon={icon}
            >
              <IconButton
                size="large"
                variant="filled"
                label="properties.form.icon.label"
              >
                <ContentIcon color="inherit" icon={icon} />
              </IconButton>
            </IconPicker>
          }
          {...fieldProps.name}
        />
        <div className="footer">
          {deletable && (
            <Button
              label="properties.actions.delete.label"
              size="small"
              variant="text"
              danger="on-hover"
              onClick={handleClickDelete}
            />
          )}
          <div className="primary-actions">
            <Button
              label="actions.cancel"
              size="small"
              variant="text"
              onClick={handleClickCancel}
            />
            <Button
              label="actions.save"
              size="small"
              variant="primary"
              onClick={handleClickSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
