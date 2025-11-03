import { Field } from '@base-ui-components/react/field';
import { Input } from '@base-ui-components/react/input';
import { mapPropsToClasses } from '../utils';
import './TextField.css';

export interface TextFieldProps extends Omit<Field.Root.Props, 'onChange'> {
  /**
   * Additional class name(s) to apply to the field's root element.
   */
  className?: string;

  /**
   * The label for the text field.
   */
  label?: string;

  /**
   * The error message to display below the input.
   */
  error?: string;

  /**
   * The description to display below the input.
   */
  description?: string;

  /**
   * The change event handler.
   */
  onChange?: Input.Props['onChange'];

  /**
   * Callback fired when the input's value changes.
   * Receives the new value as its only argument.
   */
  onValueChange?: Input.Props['onValueChange'];

  /**
   * The input's placeholder text.
   */
  placeholder?: Input.Props['placeholder'];

  /**
   * The input's default value.
   */
  defaultValue?: Input.Props['defaultValue'];

  /**
   * The input's autoComplete attribute.
   */
  autoComplete?: Input.Props['autoComplete'];

  /**
   * An icon picker component to render alongside the input.
   * If provided, the icon picker should manage the selected icon state
   * internally and render the selected icon.
   */
  iconPicker?: React.ReactNode;
}

export const TextField: React.FC<TextFieldProps> = ({
  children,
  className,
  defaultValue,
  description,
  error,
  label,
  onValueChange,
  placeholder,
  onChange,
  iconPicker,
  ...other
}) => {
  return (
    <Field.Root
      className={mapPropsToClasses({ className }, 'text-field')}
      {...other}
    >
      {label && <Field.Label className="label">{label}</Field.Label>}
      <div className="input-wrapper">
        {iconPicker}
        <Input
          className="input"
          defaultValue={defaultValue}
          onChange={onChange}
          onValueChange={onValueChange}
          placeholder={placeholder}
        />
      </div>
      {description && (
        <Field.Description className="description">
          {description}
        </Field.Description>
      )}
      {error && <div className="error">{error}</div>}
    </Field.Root>
  );
};
