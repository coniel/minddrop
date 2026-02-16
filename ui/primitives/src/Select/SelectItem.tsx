import { Select as SelectPrimitive } from '@base-ui/react/select';
import { useTranslation } from '@minddrop/i18n';
import { Icon } from '../Icon';
import { mapPropsToClasses } from '../utils';

export interface SelectItemProps {
  /**
   * The label of the item. Can be an i18n key.
   */
  label: string;

  /**
   * The value of the item.
   */
  value: string | number;

  /**
   * Class name applied to the root element.
   */
  className?: string;
}

export const SelectItem = ({ label, value, className }: SelectItemProps) => {
  const { t } = useTranslation();

  return (
    <SelectPrimitive.Item
      key={label}
      value={value}
      className={mapPropsToClasses({ className }, 'select-item')}
    >
      <SelectPrimitive.ItemIndicator className="item-indicator">
        <Icon name="check" className="item-indicator-icon" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText className="item-text">
        {t(label)}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
};
