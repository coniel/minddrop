import { IconButton, IconButtonProps } from '../IconButton';
import { mapPropsToClasses } from '../utils';
import './Toggle.css';

export interface ToggleProps extends IconButtonProps {
  /**
   * Whether the toggle is checked.
   */
  checked?: boolean;

  /**
   * Callback fired when the toggle is checked or unchecked.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Class name applied to the root element.
   */
  className?: string;
}

export const Toggle = ({
  className,
  onCheckedChange,
  variant = 'filled',
  checked = false,
  ...other
}: ToggleProps) => {
  function handleClick() {
    onCheckedChange?.(!checked);
  }

  return (
    <IconButton
      variant={variant}
      size="medium"
      className={mapPropsToClasses({ className, checked }, 'toggle')}
      onClick={handleClick}
      {...other}
    />
  );
};
