import { Select as SelectPrimitive } from '@base-ui/react/select';
import { useCallback } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { Icon } from '../Icon';
import { propsToClass } from '../utils';
import { SelectItem } from './SelectItem';
import './Select.css';

export type SelectVariant = 'ghost' | 'subtle' | 'outline' | 'filled';
export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption<TValue extends string | number> {
  /*
   * The display label for the option. Can be an i18n key.
   */
  label: string;

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
   * Visual style of the trigger. Matches Button variants for seamless
   * composition in toolbars and action rows.
   * - `ghost`   — no background or border, appears on hover
   * - `subtle`  — muted persistent background, no border
   * - `outline` — bordered, background appears on hover
   * - `filled`  — bordered + background + shadow
   * @default 'outline'
   */
  variant?: SelectVariant;

  /*
   * Size of the trigger. Matches Button sizes exactly.
   * @default 'md'
   */
  size?: SelectSize;

  /*
   * Placeholder text shown when no value is selected. Can be an i18n key.
   */
  placeholder?: string;

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
   * Offset of the popup along the alignment axis (px).
   * Positive shifts right, negative shifts left.
   */
  alignOffset?: number;
}

export const Select = <TValue extends string | number = string>({
  className,
  variant = 'outline',
  size = 'md',
  options = [],
  placeholder,
  onValueChange,
  value,
  children,
  trigger,
  alignOffset,
  ...other
}: SelectProps<TValue>) => {
  const { t } = useTranslation();

  const handleValueChange = useCallback(
    (newValue: TValue | null) => {
      if (newValue == null) return;
      onValueChange?.(newValue);
    },
    [onValueChange],
  );

  return (
    <SelectPrimitive.Root
      {...(options.length > 0 ? { items: options } : {})}
      value={value}
      onValueChange={handleValueChange}
      {...other}
    >
      <SelectPrimitive.Trigger
        className={propsToClass('select', { variant, size, className })}
      >
        {trigger ? (
          trigger
        ) : (
          <>
            <SelectPrimitive.Value
              className="select-value"
              placeholder={placeholder ? t(placeholder) : undefined}
            />
            <SelectPrimitive.Icon className="select-icon">
              <Icon name="chevron-down" />
            </SelectPrimitive.Icon>
          </>
        )}
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          className="select-positioner"
          sideOffset={8}
          alignOffset={alignOffset}
        >
          <SelectPrimitive.Popup className="select-popup">
            <SelectPrimitive.ScrollUpArrow className="select-scroll-arrow" />
            <SelectPrimitive.List className="select-list">
              {children
                ? children
                : options.map(({ label, value }) => (
                    <SelectItem
                      key={String(value)}
                      label={label}
                      value={value}
                    />
                  ))}
            </SelectPrimitive.List>
            <SelectPrimitive.ScrollDownArrow className="select-scroll-arrow" />
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
};
