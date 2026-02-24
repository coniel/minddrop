import { Field } from '@base-ui/react/field';
import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { FieldLabel } from '../fields/FieldLabel';
import type { TextFieldSize, TextFieldVariant } from '../fields/TextField';
import { propsToClass } from '../utils';
import './NumberField.css';

export interface NumberFieldProps {
  className?: string;
  variant?: TextFieldVariant;
  size?: TextFieldSize;
  label?: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

export const NumberField = React.forwardRef<HTMLDivElement, NumberFieldProps>(
  (
    {
      className,
      variant = 'outline',
      size = 'lg',
      label,
      value,
      defaultValue,
      onValueChange,
      min,
      max,
      step = 1,
      decimals,
      placeholder,
      disabled,
      error,
      leading,
      trailing,
    },
    ref,
  ) => {
    const { t } = useTranslation();

    const incrementRef = useRef<HTMLButtonElement>(null);
    const decrementRef = useRef<HTMLButtonElement>(null);

    const bump = useCallback((el: HTMLButtonElement | null) => {
      if (!el) return;
      el.classList.remove('is-bumping');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.add('is-bumping');
        });
      });
    }, []);

    const handleAnimationEnd = useCallback((el: HTMLButtonElement | null) => {
      el?.classList.remove('is-bumping');
    }, []);

    const formatOptions: Intl.NumberFormatOptions | undefined =
      decimals !== undefined
        ? { minimumFractionDigits: 0, maximumFractionDigits: decimals }
        : undefined;

    return (
      <Field.Root
        ref={ref}
        className={[
          propsToClass('number-field', { className }),
          propsToClass('text-field', { variant, size, invalid: !!error }),
        ]
          .filter(Boolean)
          .join(' ')}
        disabled={disabled}
        invalid={!!error}
      >
        {label && <FieldLabel label={label} />}

        <NumberFieldPrimitive.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          min={min}
          max={max}
          step={step}
          format={formatOptions}
          disabled={disabled}
        >
          <NumberFieldPrimitive.Group className="number-field-group">
            <div className="text-field-input-wrapper">
              {leading && <div className="text-field-leading">{leading}</div>}

              <NumberFieldPrimitive.Input
                className="text-field-input number-field-input"
                placeholder={placeholder ? t(placeholder) : undefined}
              />

              {trailing && (
                <div className="text-field-trailing">{trailing}</div>
              )}

              <div className="number-field-gradient" aria-hidden />

              <div className="number-field-stepper">
                <NumberFieldPrimitive.Increment
                  ref={incrementRef}
                  className="number-field-increment"
                  onClick={() => bump(incrementRef.current)}
                  onAnimationEnd={() =>
                    handleAnimationEnd(incrementRef.current)
                  }
                >
                  <span className="number-field-increment-icon" aria-hidden />
                </NumberFieldPrimitive.Increment>

                <NumberFieldPrimitive.Decrement
                  ref={decrementRef}
                  className="number-field-decrement"
                  onClick={() => bump(decrementRef.current)}
                  onAnimationEnd={() =>
                    handleAnimationEnd(decrementRef.current)
                  }
                >
                  <span className="number-field-decrement-icon" aria-hidden />
                </NumberFieldPrimitive.Decrement>
              </div>
            </div>

            {error && <div className="text-field-error">{t(error)}</div>}
          </NumberFieldPrimitive.Group>
        </NumberFieldPrimitive.Root>
      </Field.Root>
    );
  },
);

NumberField.displayName = 'NumberField';
