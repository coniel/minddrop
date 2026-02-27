import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import React from 'react';
import { propsToClass } from '../utils';
import './Slider.css';

export type SliderSize = 'sm' | 'md';

export interface SliderProps {
  /**
   * Size of the slider track and thumb.
   * @default 'md'
   */
  size?: SliderSize;

  /**
   * Controlled value. Pass an array for range sliders.
   */
  value?: number | number[];

  /**
   * Default value for uncontrolled usage.
   * @default 0
   */
  defaultValue?: number | number[];

  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: number | number[]) => void;

  /**
   * Callback fired when the user finishes dragging.
   */
  onValueCommitted?: (value: number | number[]) => void;

  /**
   * Minimum value.
   * @default 0
   */
  min?: number;

  /**
   * Maximum value.
   * @default 100
   */
  max?: number;

  /**
   * Step increment.
   * @default 1
   */
  step?: number;

  /**
   * Renders tick marks at each step along the track.
   * @default false
   */
  stepped?: boolean;

  /**
   * Prevents interaction.
   */
  disabled?: boolean;

  /**
   * Accessible label for the thumb.
   */
  ariaLabel?: string;

  /**
   * Class name applied to the root element.
   */
  className?: string;
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      size = 'md',
      value,
      defaultValue,
      onValueChange,
      onValueCommitted,
      min = 0,
      max = 100,
      step = 1,
      disabled,
      ariaLabel,
      className,
    },
    ref,
  ) => {
    const normalizedValue = value !== undefined
      ? (Array.isArray(value) ? value : [value])
      : undefined;

    const normalizedDefault = defaultValue !== undefined
      ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue])
      : undefined;

    const handleValueChange = onValueChange
      ? (nextValue: number | number[]) => {
        if (Array.isArray(nextValue) && nextValue.length === 1) {
          onValueChange(nextValue[0]);
        } else {
          onValueChange(nextValue);
        }
      }
      : undefined;

    const handleValueCommitted = onValueCommitted
      ? (nextValue: number | number[]) => {
        if (Array.isArray(nextValue) && nextValue.length === 1) {
          onValueCommitted(nextValue[0]);
        } else {
          onValueCommitted(nextValue);
        }
      }
      : undefined;

    return (
      <SliderPrimitive.Root
        ref={ref}
        value={normalizedValue}
        defaultValue={normalizedDefault}
        onValueChange={handleValueChange}
        onValueCommitted={handleValueCommitted}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={propsToClass('slider', { size, className })}
      >
        <SliderPrimitive.Control className="slider-control">
          <SliderPrimitive.Track className="slider-track">
            <SliderPrimitive.Indicator className="slider-indicator" />
            <SliderPrimitive.Thumb
              className="slider-thumb"
              aria-label={ariaLabel}
            />
          </SliderPrimitive.Track>
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
    );
  },
);

Slider.displayName = 'Slider';
