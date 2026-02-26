import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from '@minddrop/i18n';
import type { TextInputSize, TextInputVariant } from '../../fields/TextInput';
import { propsToClass } from '../../utils';
import './NumberInput.css';

export type NumberInputVariant = TextInputVariant;
export type NumberInputSize = TextInputSize;

export interface NumberInputProps {
  className?: string;
  variant?: NumberInputVariant;
  size?: NumberInputSize;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

export const NumberInput = React.forwardRef<HTMLDivElement, NumberInputProps>(
  (
    {
      className,
      variant = 'outline',
      size = 'lg',
      value,
      defaultValue,
      onValueChange,
      min,
      max,
      step = 1,
      decimals,
      placeholder,
      disabled,
      invalid,
      leading,
      trailing,
    },
    ref,
  ) => {
    const { t } = useTranslation();

    const inputRef = useRef<HTMLInputElement>(null);
    const incrementRef = useRef<HTMLButtonElement>(null);
    const decrementRef = useRef<HTMLButtonElement>(null);

    const handleContainerClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!(e.target as HTMLElement).closest('input, button')) {
          inputRef.current?.focus();
        }
      },
      [],
    );

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
      <NumberFieldPrimitive.Root
        ref={ref}
        onClick={handleContainerClick}
        className={[
          propsToClass('number-input', { className }),
          propsToClass('text-input', { variant, size, invalid }),
        ]
          .filter(Boolean)
          .join(' ')}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        format={formatOptions}
        disabled={disabled}
      >
        <NumberFieldPrimitive.Group className="number-input-group">
          {leading && <div className="text-input-leading">{leading}</div>}

          <NumberFieldPrimitive.Input
            ref={inputRef}
            className="text-input-input number-input-input"
            placeholder={placeholder ? t(placeholder) : undefined}
          />

          {trailing && (
            <div className="text-input-trailing">{trailing}</div>
          )}

          <div className="number-input-gradient" aria-hidden />

          <div className="number-input-stepper">
            <NumberFieldPrimitive.Increment
              ref={incrementRef}
              className="number-input-increment"
              onClick={() => bump(incrementRef.current)}
              onAnimationEnd={() => handleAnimationEnd(incrementRef.current)}
            >
              <span className="number-input-increment-icon" aria-hidden />
            </NumberFieldPrimitive.Increment>

            <NumberFieldPrimitive.Decrement
              ref={decrementRef}
              className="number-input-decrement"
              onClick={() => bump(decrementRef.current)}
              onAnimationEnd={() => handleAnimationEnd(decrementRef.current)}
            >
              <span className="number-input-decrement-icon" aria-hidden />
            </NumberFieldPrimitive.Decrement>
          </div>
        </NumberFieldPrimitive.Group>
      </NumberFieldPrimitive.Root>
    );
  },
);

NumberInput.displayName = 'NumberInput';
