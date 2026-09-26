import { Input } from '@base-ui/react/input';
import React from 'react';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { Icon } from '../../Icon';
import { propsToClass } from '../../utils';
import './ChipsInput.css';

export type ChipsInputVariant = 'subtle' | 'outline' | 'filled';
export type ChipsInputSize = 'md' | 'lg';

export interface ChipsInputProps {
  /**
   * Class name applied to the wrapper element.
   */
  className?: string;

  /**
   * Visual style of the input. Matches TextInput variants.
   * @default 'outline'
   */
  variant?: ChipsInputVariant;

  /**
   * Height of the input before its chips wrap. Matches TextInput
   * sizes.
   * @default 'lg'
   */
  size?: ChipsInputSize;

  /**
   * The chips.
   */
  value: string[];

  /**
   * Callback fired with the chips when one is added or removed.
   */
  onValueChange: (value: string[]) => void;

  /**
   * Transforms a typed value before it is validated and added.
   */
  normalize?: (value: string) => string;

  /**
   * Checks a typed value before it is added. Return false to reject
   * it. A rejected value stays in the input.
   */
  validate?: (value: string) => boolean;

  /**
   * Also adds the typed value on Space, and splits pasted text on
   * spaces. For values which never contain a space.
   */
  splitOnSpace?: boolean;

  /**
   * Callback fired with the text as it is typed.
   */
  onInputValueChange?: (value: string) => void;

  /**
   * Placeholder text shown while there are no chips.
   */
  placeholder?: TranslationKey;

  /**
   * Plain string placeholder used as-is without i18n translation.
   * Takes priority over `placeholder`.
   */
  stringPlaceholder?: string;

  /**
   * Marks the input as invalid (applies error styling).
   */
  invalid?: boolean;

  /**
   * Disables the input.
   */
  disabled?: boolean;

  /**
   * Whether the input is focused when mounted.
   */
  autoFocus?: boolean;
}

/**
 * Renders a text input which turns each typed value into a removable
 * chip.
 */
export const ChipsInput = React.forwardRef<HTMLInputElement, ChipsInputProps>(
  (
    {
      className,
      variant = 'outline',
      size = 'lg',
      value,
      onValueChange,
      normalize,
      validate,
      splitOnSpace,
      onInputValueChange,
      placeholder,
      stringPlaceholder,
      invalid,
      disabled,
      autoFocus,
    },
    ref,
  ) => {
    // Fallback ref, used when no ref is forwarded
    const innerRef = React.useRef<HTMLInputElement>(null);
    // Resolve the input's ref
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || innerRef;
    // The text being typed
    const [inputValue, setInputValue] = React.useState('');
    // ID tying the wrapping label to the input. A label's implicit
    // control is its first labelable descendant. Once there are chips,
    // that is a chip's remove button.
    const inputId = React.useId();
    const { t } = useTranslation();

    // Resolve the separator between values in typed or pasted text
    const separator = splitOnSpace ? /[,\s]+/ : /,+/;

    // Add each value in the typed text as a chip
    function commitInputValue() {
      // The chips to add
      const chips: string[] = [];
      // The values `validate` rejects
      const rejectedValues: string[] = [];

      // Split the text into trimmed, non-empty values
      inputValue
        .split(separator)
        .map((typedValue) => typedValue.trim())
        .filter(Boolean)
        .forEach((typedValue) => {
          // Normalize the value
          const chip = normalize ? normalize(typedValue) : typedValue;

          // Check if the value normalizes to an empty string or is
          // already a chip. If so, skip it.
          if (!chip || value.includes(chip) || chips.includes(chip)) {
            return;
          }

          // Check the value passes validation. If not, add it to the
          // rejected values.
          if (validate && !validate(chip)) {
            rejectedValues.push(typedValue);

            return;
          }

          // Add the chip
          chips.push(chip);
        });

      // Emit the chips with the new ones added, if any
      if (chips.length) {
        onValueChange([...value, ...chips]);
      }

      // Leave the rejected values in the input for correction
      setInputValue(rejectedValues.join(splitOnSpace ? ' ' : ', '));
    }

    // Update the typed text and emit it
    function handleInputValueChange(newValue: string) {
      setInputValue(newValue);
      onInputValueChange?.(newValue);
    }

    // Add or remove chips from the keyboard
    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
      // Check if the key is Enter, comma, or Space when splitting on
      // spaces. If so, add the typed text.
      if (
        event.key === 'Enter' ||
        event.key === ',' ||
        (splitOnSpace && event.key === ' ')
      ) {
        // Prevent the key's default action and add the typed text
        event.preventDefault();
        commitInputValue();

        return;
      }

      // Check if Backspace is pressed in the empty input. If so,
      // remove the last chip.
      if (event.key === 'Backspace' && !inputValue && value.length) {
        onValueChange(value.slice(0, -1));
      }
    }

    // Remove the chip and refocus the input
    function handleRemove(chip: string) {
      onValueChange(value.filter((otherChip) => otherChip !== chip));
      inputRef.current?.focus();
    }

    return (
      <label
        htmlFor={inputId}
        className={propsToClass('chips-input', {
          variant,
          size,
          invalid,
          disabled,
          className,
        })}
      >
        {/* Chips */}
        {value.map((chip) => (
          <span key={chip} className="chips-input-chip">
            <span className="chips-input-chip-label">{chip}</span>
            <button
              type="button"
              className="chips-input-chip-remove"
              aria-label={`${t('actions.remove')} ${chip}`}
              disabled={disabled}
              onClick={() => handleRemove(chip)}
            >
              <Icon name="x" className="chips-input-chip-remove-icon" />
            </button>
          </span>
        ))}
        {/* Text input */}
        <Input
          ref={inputRef}
          id={inputId}
          className="chips-input-input"
          value={inputValue}
          placeholder={
            value.length
              ? undefined
              : (stringPlaceholder ?? (placeholder && t(placeholder)))
          }
          autoFocus={autoFocus}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          disabled={disabled}
          onValueChange={handleInputValueChange}
          onKeyDown={handleKeyDown}
          onBlur={commitInputValue}
        />
      </label>
    );
  },
);

ChipsInput.displayName = 'ChipsInput';
