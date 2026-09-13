import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field';
import React, { useCallback, useRef } from 'react';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { Icon } from '../../Icon';
import type { TextInputSize, TextInputVariant } from '../../fields/TextInput';
import { propsToClass } from '../../utils';
import './NumberInput.css';

export type NumberInputVariant = TextInputVariant;
export type NumberInputSize = TextInputSize;

/**
 * Where the step buttons sit: a spinner revealed at the input's end
 * on hover, or minus and plus buttons at either end, always shown.
 */
export type NumberInputStepper = 'spin' | 'ends';

export interface NumberInputProps {
  className?: string;
  variant?: NumberInputVariant;
  size?: NumberInputSize;
  stepper?: NumberInputStepper;
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  placeholder?: TranslationKey;
  disabled?: boolean;
  invalid?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  clearable?: boolean;
  onBlur?: () => void;
}

export const NumberInput = React.forwardRef<HTMLDivElement, NumberInputProps>(
  (
    {
      className,
      variant = 'outline',
      size = 'lg',
      stepper = 'spin',
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
      clearable,
      onBlur,
    },
    ref,
  ) => {
    const { t } = useTranslation();

    const inputRef = useRef<HTMLInputElement>(null);
    const incrementRef = useRef<HTMLButtonElement>(null);
    const decrementRef = useRef<HTMLButtonElement>(null);

    // The step buttons stand at the input's ends rather than in a
    // spinner revealed on hover.
    const ends = stepper === 'ends';

    // Whether the input is empty, which a clearable input steps
    // into and out of.
    const empty = value === undefined || value === null;

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

    // What the step buttons show: the spinner's triangles, or the
    // minus and plus icons at the ends.
    const incrementContent = ends ? (
      <Icon name="plus" />
    ) : (
      <span className="number-input-increment-icon" aria-hidden />
    );
    const decrementContent = ends ? (
      <Icon name="minus" />
    ) : (
      <span className="number-input-decrement-icon" aria-hidden />
    );

    // Renders the button stepping up. A cleared clearable input
    // steps into its lowest value.
    function renderIncrement() {
      if (clearable && empty) {
        return (
          <button
            ref={incrementRef}
            type="button"
            className="number-input-increment"
            aria-label={t('labels.increase')}
            onClick={() => {
              onValueChange?.(min ?? step);
              bump(incrementRef.current);
            }}
            onAnimationEnd={() => handleAnimationEnd(incrementRef.current)}
          >
            {incrementContent}
          </button>
        );
      }

      return (
        <NumberFieldPrimitive.Increment
          ref={incrementRef}
          className="number-input-increment"
          onClick={() => bump(incrementRef.current)}
          onAnimationEnd={() => handleAnimationEnd(incrementRef.current)}
        >
          {incrementContent}
        </NumberFieldPrimitive.Increment>
      );
    }

    // Renders the button stepping down. A clearable input at its
    // lowest value steps out to empty, and stops there.
    function renderDecrement() {
      if (clearable && empty) {
        return (
          <button
            ref={decrementRef}
            type="button"
            className="number-input-decrement"
            aria-label={t('labels.decrease')}
            disabled
          >
            {decrementContent}
          </button>
        );
      }

      if (clearable && !empty && value <= min!) {
        return (
          <button
            ref={decrementRef}
            type="button"
            className="number-input-decrement"
            aria-label={t('labels.decrease')}
            onClick={() => {
              onValueChange?.(null);
              bump(decrementRef.current);
            }}
            onAnimationEnd={() => handleAnimationEnd(decrementRef.current)}
          >
            {decrementContent}
          </button>
        );
      }

      return (
        <NumberFieldPrimitive.Decrement
          ref={decrementRef}
          className="number-input-decrement"
          onClick={() => bump(decrementRef.current)}
          onAnimationEnd={() => handleAnimationEnd(decrementRef.current)}
        >
          {decrementContent}
        </NumberFieldPrimitive.Decrement>
      );
    }

    return (
      <NumberFieldPrimitive.Root
        ref={ref}
        onClick={handleContainerClick}
        className={[
          propsToClass('number-input', { className, stepper }),
          propsToClass('text-input', { variant, size, invalid }),
        ]
          .filter(Boolean)
          .join(' ')}
        value={value}
        defaultValue={defaultValue ?? undefined}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        format={formatOptions}
        disabled={disabled}
      >
        <NumberFieldPrimitive.Group className="number-input-group">
          {ends && renderDecrement()}

          {leading && <div className="text-input-leading">{leading}</div>}

          <NumberFieldPrimitive.Input
            ref={inputRef}
            className="text-input-input number-input-input"
            placeholder={placeholder ? t(placeholder) : undefined}
            onBlur={onBlur}
          />

          {trailing && <div className="text-input-trailing">{trailing}</div>}

          {ends ? (
            renderIncrement()
          ) : (
            <>
              <div className="number-input-gradient" aria-hidden />

              <div className="number-input-stepper">
                {renderIncrement()}
                {renderDecrement()}
              </div>
            </>
          )}
        </NumberFieldPrimitive.Group>
      </NumberFieldPrimitive.Root>
    );
  },
);

NumberInput.displayName = 'NumberInput';
