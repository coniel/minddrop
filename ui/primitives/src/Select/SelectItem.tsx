import { Select as SelectPrimitive } from '@base-ui/react/select';
import { useTranslation } from '@minddrop/i18n';
import { Icon } from '../Icon';
import { propsToClass } from '../utils';

export interface SelectItemProps {
  /*
   * The display label for the item. Can be an i18n key.
   */
  label: string;

  /*
   * The value of the item.
   */
  value: string | number;

  /*
   * Class name applied to the root element.
   */
  className?: string;
}

export const SelectItem = ({ label, value, className }: SelectItemProps) => {
  const { t } = useTranslation();

  return (
    <SelectPrimitive.Item
      value={value}
      className={propsToClass('select-item', { className })}
    >
      <SelectPrimitive.ItemIndicator className="select-item-indicator">
        <Icon name="check" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText className="select-item-text">
        {t(label)}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
};
