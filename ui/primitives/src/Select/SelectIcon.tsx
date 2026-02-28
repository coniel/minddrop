import { Select as SelectPrimitive } from '@base-ui/react/select';
import { Icon } from '../Icon';

/* --- SelectIcon ---
   Wraps Select.Icon with the chevron-down icon. */

export const SelectIcon = () => (
  <SelectPrimitive.Icon className="select-icon">
    <Icon name="chevron-down" />
  </SelectPrimitive.Icon>
);
