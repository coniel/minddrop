import { Field } from '@base-ui/react/field';
import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import React, { useId } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { propsToClass } from '../../utils';
import './Radio.css';

/* ============================================================
   RADIO INDICATOR (primitive)
   The visible circle. Used inside RadioField and RadioCard.
   ============================================================ */

export interface RadioProps extends RadioPrimitive.Root.Props {
  className?: string;
}

export const Radio: React.FC<RadioProps> = ({ className, ...other }) => (
  <RadioPrimitive.Root
    className={propsToClass('radio-indicator', { className })}
    {...other}
  >
    <RadioPrimitive.Indicator>
      <div className="radio-dot" />
    </RadioPrimitive.Indicator>
  </RadioPrimitive.Root>
);

/* ============================================================
   RADIO FIELD
   Radio indicator + label + optional description.
   Must be placed inside a RadioGroup.
   ============================================================ */

export interface RadioFieldProps {
  /*
   * The value this radio represents.
   */
  value: string;

  /*
   * Label text. Can be an i18n key.
   */
  label?: string;

  /*
   * Label content. Used when no i18n key is provided.
   */
  children?: React.ReactNode;

  /*
   * Helper text below the label.
   */
  description?: string;

  /*
   * Prevents interaction.
   */
  disabled?: boolean;

  /*
   * Class name applied to the root element.
   */
  className?: string;
}

export const RadioField: React.FC<RadioFieldProps> = ({
  value,
  label,
  children,
  description,
  disabled,
  className,
}) => {
  const { t } = useTranslation();
  const id = useId();

  return (
    <Field.Root
      className={propsToClass('radio-field', { className })}
      disabled={disabled}
    >
      <Radio value={value} id={id} disabled={disabled} />
      <div className="radio-field-content">
        {(label || children) && (
          <Field.Label className="radio-field-label" htmlFor={id}>
            {label ? t(label) : children}
          </Field.Label>
        )}
        {description && (
          <Field.Description className="radio-field-description">
            {t(description)}
          </Field.Description>
        )}
      </div>
    </Field.Root>
  );
};

/* ============================================================
   RADIO GROUP
   Wraps RadioField children. Manages selected value.
   ============================================================ */

export interface RadioGroupProps {
  /*
   * Currently selected value (controlled).
   */
  value?: string;

  /*
   * Default selected value for uncontrolled usage.
   */
  defaultValue?: string;

  /*
   * Callback fired when the selection changes.
   */
  onValueChange?: (value: string) => void;

  /*
   * Group label rendered above the options.
   */
  label?: string;

  /*
   * Disables all radio fields in the group.
   */
  disabled?: boolean;

  /*
   * Class name applied to the root element.
   */
  className?: string;

  /*
   * RadioField children.
   */
  children: React.ReactNode;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  defaultValue,
  onValueChange,
  label,
  disabled,
  className,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <RadioGroupPrimitive
      className={propsToClass('radio-group', { className })}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      aria-label={label ? t(label) : undefined}
    >
      {label && <div className="radio-group-label">{t(label)}</div>}
      {children}
    </RadioGroupPrimitive>
  );
};

/* ============================================================
   RADIO CARD
   Large card-style radio option. Must be inside RadioCardGroup.
   ============================================================ */

export type RadioCardVariant = 'outline' | 'subtle';

export interface RadioCardProps {
  /*
   * The value this card represents.
   */
  value: string;

  /*
   * Card title.
   */
  title: string;

  /*
   * Card description below the title.
   */
  description?: string;

  /*
   * Optional icon or any node rendered above the title.
   */
  icon?: React.ReactNode;

  /*
   * Visual style of the card.
   * - `outline` — bordered, fills with primary tint when selected
   * - `subtle`  — filled surface, stronger tint when selected
   * @default 'outline'
   */
  variant?: RadioCardVariant;

  /*
   * Prevents interaction.
   */
  disabled?: boolean;

  /*
   * Class name applied to the root element.
   */
  className?: string;
}

export const RadioCard: React.FC<RadioCardProps> = ({
  value,
  title,
  description,
  icon,
  variant = 'outline',
  disabled,
  className,
}) => {
  const { t } = useTranslation();
  const id = useId();

  return (
    <RadioPrimitive.Root
      value={value}
      id={id}
      disabled={disabled}
      className={propsToClass('radio-card', { variant, className })}
      render={(props) => <div {...props} />}
    >
      {/* Indicator sits absolutely in top-left corner */}
      <Radio value={value} disabled={disabled} />

      <div className="radio-card-content">
        {icon && <div className="radio-card-icon">{icon}</div>}
        <div className="radio-card-title">{t(title)}</div>
        {description && (
          <div className="radio-card-description">{t(description)}</div>
        )}
      </div>
    </RadioPrimitive.Root>
  );
};

/* ============================================================
   RADIO CARD GROUP
   Wraps RadioCard children. Manages selected value.
   ============================================================ */

export type RadioCardGroupDirection = 'vertical' | 'horizontal';

export interface RadioCardGroupProps {
  /*
   * Currently selected value (controlled).
   */
  value?: string;

  /*
   * Default selected value for uncontrolled usage.
   */
  defaultValue?: string;

  /*
   * Callback fired when the selection changes.
   */
  onValueChange?: (value: string) => void;

  /*
   * Group label rendered above the cards.
   */
  label?: string;

  /*
   * Layout direction of the cards.
   * @default 'vertical'
   */
  direction?: RadioCardGroupDirection;

  /*
   * Disables all cards in the group.
   */
  disabled?: boolean;

  /*
   * Class name applied to the root element.
   */
  className?: string;

  /*
   * RadioCard children.
   */
  children: React.ReactNode;
}

export const RadioCardGroup: React.FC<RadioCardGroupProps> = ({
  value,
  defaultValue,
  onValueChange,
  label,
  direction = 'vertical',
  disabled,
  className,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <RadioGroupPrimitive
      className={propsToClass('radio-card-group', { direction, className })}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      aria-label={label ? t(label) : undefined}
    >
      {label && <div className="radio-card-group-label">{t(label)}</div>}
      {children}
    </RadioGroupPrimitive>
  );
};
