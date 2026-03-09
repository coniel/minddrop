import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { FC } from 'react';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { Icon } from '../Icon';

/* --- ComboboxInput ---
   Search input rendered inside the popup with a search icon. */

export interface ComboboxInputProps extends ComboboxPrimitive.Input.Props {
  /**
   * Placeholder text. Can be an i18n key.
   */
  placeholder?: TranslationKey;

  /**
   * Class name applied to the input element.
   */
  className?: string;
}

/** Search input for inside the combobox popup. */
export const ComboboxInput: FC<ComboboxInputProps> = ({
  placeholder,
  className,
  ...other
}) => {
  const { t } = useTranslation();

  return (
    <div className="combobox-input-wrapper">
      <Icon name="search" size={14} className="combobox-input-icon" />
      <ComboboxPrimitive.Input
        className={`combobox-input${className ? ` ${className}` : ''}`}
        placeholder={placeholder ? t(placeholder) : undefined}
        {...other}
      />
    </div>
  );
};
