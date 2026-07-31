import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { TextColor } from '../Text';
import { SelectIcon } from './SelectIcon';
import { SelectItem } from './SelectItem';
import { SelectPopup } from './SelectPopup';
import { SelectRoot } from './SelectRoot';
import { SelectTrigger } from './SelectTrigger';
import { SelectValue } from './SelectValue';
import './Select.css';

export type SelectVariant = 'ghost' | 'subtle' | 'outline' | 'filled';
export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption<TValue extends string | number> {
  /*
   * The display label for the option. Can be an i18n key.
   * Ignored when `stringLabel` is provided.
   */
  label?: TranslationKey;

  /*
   * Plain string display label for dynamic values (e.g. user
   * defined names) that are not translatable.
   */
  stringLabel?: string;

  /*
   * The value of the option.
   */
  value: TValue;
}

export interface SelectProps<TValue extends string | number> {
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
   * Placeholder text shown when no value is selected. Can be an i18n key.
   */
  placeholder?: TranslationKey;

  /*
   * The options to render as select items.
   * Ignored when `children` is provided.
   */
  options?: SelectOption<TValue>[];

  /*
   * The controlled value of the select.
   */
  value?: TValue;

  /*
   * Callback fired when the selected value changes.
   */
  onValueChange?: (value: TValue) => void;

  /*
   * Custom select item content. When provided, `options` is ignored,
   * allowing full control over item rendering.
   */
  children?: React.ReactNode;

  /*
   * Custom trigger element. When provided, the default trigger is
   * replaced with the provided element.
   */
  trigger?: React.ReactElement;

  /*
   * Color of the displayed value text. Uses Text color tokens.
   */
  valueColor?: TextColor;

  /*
   * Offset of the popup along the alignment axis (px).
   * Positive shifts right, negative shifts left.
   */
  alignOffset?: number;

  /*
   * Whether the select is disabled.
   */
  disabled?: boolean;
}

export const Select = <TValue extends string | number = string>({
  className,
  variant = 'outline',
  size = 'md',
  options = [],
  placeholder,
  onValueChange,
  value,
  valueColor,
  children,
  trigger,
  alignOffset,
  disabled,
}: SelectProps<TValue>) => {
  const { t } = useTranslation();

  return (
    <SelectRoot
      items={options.map(({ value, label, stringLabel }) => ({
        value,
        // Translate label keys so the selected value renders the
        // translated text
        label: stringLabel ?? (label ? t(label) : ''),
      }))}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={className} variant={variant} size={size}>
        {trigger ? (
          trigger
        ) : (
          <>
            <SelectValue color={valueColor} placeholder={placeholder} />
            <SelectIcon />
          </>
        )}
      </SelectTrigger>
      <SelectPopup alignOffset={alignOffset}>
        {children
          ? children
          : options.map(({ label, stringLabel, value }) => (
              <SelectItem key={String(value)} label={label} value={value}>
                {stringLabel}
              </SelectItem>
            ))}
      </SelectPopup>
    </SelectRoot>
  );
};
