import { Field } from '@base-ui-components/react/field';
import { Input } from '@base-ui-components/react/input';
import { mapPropsToClasses } from '../utils';
import './TextField.css';

export interface TextFieldProps
  extends Omit<Field.Root.Props, 'onChange'>,
    Pick<Input.Props, 'defaultValue' | 'onValueChange' | 'placeholder'> {
  /**
   * Additional class name(s) to apply to the field's root element.
   */
  className?: string;

  label?: string;

  error?: string;

  description?: string;

  onChange?: Input.Props['onChange'];
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
  ...other
}) => {
  return (
    <Field.Root
      className={mapPropsToClasses({ className }, 'text-field')}
      {...other}
    >
      {label && <Field.Label className="label">{label}</Field.Label>}
      <Input
        className="input"
        defaultValue={defaultValue}
        onChange={onChange}
        onValueChange={onValueChange}
        placeholder={placeholder}
      />
      {description && (
        <Field.Description className="description">
          {description}
        </Field.Description>
      )}
      {error && <div className="error">{error}</div>}
    </Field.Root>
  );
};
