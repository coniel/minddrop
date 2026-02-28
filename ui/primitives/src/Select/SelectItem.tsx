import { Select as SelectPrimitive } from '@base-ui/react/select';
import { useTranslation } from '@minddrop/i18n';
import { Icon } from '../Icon';
import { propsToClass } from '../utils';

export interface SelectItemProps {
  /*
   * The display label for the item. Can be an i18n key.
   * Ignored when `children` is provided.
   */
  label?: string;

  /*
   * The value of the item.
   */
  value: string | number;

  /*
   * Class name applied to the root element.
   */
  className?: string;

  /*
   * Whether to hide the check indicator column.
   * When true, the item uses a single-column flex layout
   * instead of the two-column grid.
   * @default false
   */
  hideIndicator?: boolean;

  /*
   * Custom item content. When provided, `label` is ignored,
   * allowing full control over the item text rendering.
   */
  children?: React.ReactNode;
}

export const SelectItem = ({
  label,
  value,
  className,
  hideIndicator = false,
  children,
}: SelectItemProps) => {
  const { t } = useTranslation();

  return (
    <SelectPrimitive.Item
      value={value}
      className={propsToClass('select-item', {
        className,
        'hide-indicator': hideIndicator || undefined,
      })}
    >
      {!hideIndicator && (
        <SelectPrimitive.ItemIndicator className="select-item-indicator">
          <Icon name="check" />
        </SelectPrimitive.ItemIndicator>
      )}
      <SelectPrimitive.ItemText className="select-item-text">
        {children ? children : t(label || '')}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
};
