import { Select as SelectPrimitive } from '@base-ui/react/select';
import { useTranslation } from '@minddrop/i18n';
import { TextColor } from '../Text';
import { propsToClass } from '../utils';

/* --- SelectValue ---
   Wraps Select.Value with color class and placeholder translation. */

export interface SelectValueProps {
  /*
   * Class name applied to the value element.
   */
  className?: string;

  /*
   * Color of the displayed value text. Uses Text color tokens.
   */
  color?: TextColor;

  /*
   * Placeholder text shown when no value is selected. Can be an i18n key.
   */
  placeholder?: string;

  /*
   * Custom rendered value content. When provided, overrides
   * the default rendered value from Base UI.
   */
  children?: React.ReactNode;
}

export const SelectValue = ({
  className,
  color,
  placeholder,
  children,
}: SelectValueProps) => {
  const { t } = useTranslation();

  return (
    <SelectPrimitive.Value
      className={propsToClass('select-value', { color, className })}
      placeholder={placeholder ? t(placeholder) : undefined}
    >
      {children}
    </SelectPrimitive.Value>
  );
};
