import { Select as SelectPrimitive } from '@base-ui/react/select';
import { propsToClass } from '../utils';
import { SelectSize, SelectVariant } from './Select';

/* --- SelectTrigger ---
   Wraps Select.Trigger with variant/size class generation. */

export interface SelectTriggerProps {
  /*
   * Class name applied to the trigger element.
   */
  className?: string;

  /*
   * Visual style of the trigger.
   * @default 'outline'
   */
  variant?: SelectVariant;

  /*
   * Size of the trigger.
   * @default 'md'
   */
  size?: SelectSize;

  /*
   * The trigger content.
   */
  children: React.ReactNode;
}

export const SelectTrigger = ({
  className,
  variant = 'outline',
  size = 'md',
  children,
}: SelectTriggerProps) => (
  <SelectPrimitive.Trigger
    className={propsToClass('select', { variant, size, className })}
  >
    {children}
  </SelectPrimitive.Trigger>
);
