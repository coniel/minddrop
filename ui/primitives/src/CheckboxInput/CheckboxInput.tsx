import { mapPropsToClasses } from '@minddrop/utils';
import { FieldLabel } from '../FieldLabel';
import { Group } from '../Group';
import { Icon } from '../Icon';

export interface CheckboxInputProps {
  /**
   * Whether the checkbox is checked.
   */
  checked?: boolean;

  /**
   * Callback fired when the checkbox is checked or unchecked.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * The label for the checkbox input.
   */
  label?: string;

  /**
   * The name of the checkbox input. Also used as the checkbox's id
   * if not `id` prop is provided.
   */
  name?: string;

  /**
   * The id of the checkbox input.
   */
  id?: string;

  /**
   * Class name applied to the root element.
   */
  className?: string;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  checked = false,
  onCheckedChange,
  name,
  id,
  label,
  className,
  ...other
}) => {
  function togglechecked() {
    onCheckedChange?.(!checked);
  }

  return (
    <Group
      pos="relative"
      gap="xs"
      className={mapPropsToClasses({ className }, 'checkbox-input')}
      {...other}
    >
      <>
        <input
          type="checkbox"
          aria-hidden="true"
          style={{ opacity: 0, pointerEvents: 'none', position: 'absolute' }}
          tabIndex={-1}
          value="on"
          checked={checked}
          name={name}
          id={id || name}
          onChange={togglechecked}
        />
        <Icon
          onClick={togglechecked}
          role="button"
          name={checked ? 'check-square-2' : 'square'}
        />
      </>
      <FieldLabel
        size="regular"
        htmlFor={id || name}
        label={label}
        style={{ flex: 1 }}
      />
    </Group>
  );
};
