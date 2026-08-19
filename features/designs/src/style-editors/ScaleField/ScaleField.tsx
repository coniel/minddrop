import { useMemo } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import {
  IconButton,
  InputLabel,
  Select,
  SelectOption,
  Stack,
  Text,
} from '@minddrop/ui-primitives';
import './ScaleField.css';

// Value standing in for an unset step, since a select cannot carry
// undefined as an option value
const EmptyValue = '__empty__';

/**
 * The option shown for an unset value, on fields where a value can
 * be left off.
 */
export interface ScaleFieldEmptyOption {
  /**
   * The i18n key of the option's label.
   */
  label: TranslationKey;

  /**
   * The i18n key of the helper text explaining what leaving the
   * value off does.
   */
  description?: TranslationKey;
}

export interface ScaleFieldProps<TStep extends string | number> {
  /**
   * The field label. Omitted on fields whose section already
   * names them.
   */
  label?: TranslationKey;

  /**
   * The steps of the scale, in order from smallest to largest.
   */
  steps: readonly TStep[];

  /**
   * The step currently set, or undefined when the field is empty.
   */
  value: TStep | undefined;

  /**
   * Builds the i18n key of a step's label.
   */
  stepLabelKey?: (step: TStep) => TranslationKey;

  /**
   * Builds the plain text label of a step, for scales labelled by
   * their value rather than a translation (e.g. percentages).
   * Takes priority over stepLabelKey.
   */
  stepStringLabel?: (step: TStep) => string;

  /**
   * Builds the i18n key of the note shown beside a step's label,
   * e.g. the measurement it resolves to.
   */
  stepHintKey?: (step: TStep) => TranslationKey;

  /**
   * Builds the i18n key of a step's helper text, shown in the list
   * of steps.
   */
  stepDescriptionKey?: (step: TStep) => TranslationKey;

  /**
   * The option shown when the field is empty. Omitted, the field
   * always holds a step and cannot be stepped down out of the
   * scale.
   */
  emptyOption?: ScaleFieldEmptyOption;

  /**
   * The lowest step the field accepts, for values bounded by
   * another field. Steps below it are offered but cannot be
   * chosen.
   */
  lowestStep?: TStep;

  /**
   * The i18n key of the label announced by the button stepping
   * down the scale.
   */
  decreaseLabel: TranslationKey;

  /**
   * The i18n key of the label announced by the button stepping up
   * the scale.
   */
  increaseLabel: TranslationKey;

  /**
   * Called with the chosen step, or undefined when the field is
   * emptied.
   */
  onChange: (value: TStep | undefined) => void;
}

/**
 * Renders an ordered scale as a stepper, for values read as more
 * or less of something rather than as a set of named choices. The
 * step itself opens the whole scale, for reaching a distant step
 * in one go.
 */
export function ScaleField<TStep extends string | number>({
  label,
  steps,
  value,
  stepLabelKey,
  stepStringLabel,
  stepHintKey,
  stepDescriptionKey,
  emptyOption,
  lowestStep,
  decreaseLabel,
  increaseLabel,
  onChange,
}: ScaleFieldProps<TStep>) {
  // The first step the field accepts, which the steps below are
  // shown against rather than left out of the scale
  const floor = lowestStep === undefined ? 0 : steps.indexOf(lowestStep);

  // The scale as select options, opening with the empty option on
  // fields which have one
  const options = useMemo<SelectOption<string | number>[]>(() => {
    const stepOptions = steps.map((step, index) => ({
      value: step,
      label: stepLabelKey?.(step),
      stringLabel: stepStringLabel?.(step),
      hint: stepHintKey?.(step),
      description: stepDescriptionKey?.(step),
      disabled: index < floor,
    }));

    if (!emptyOption) {
      return stepOptions;
    }

    return [
      {
        value: EmptyValue,
        label: emptyOption.label,
        description: emptyOption.description,
      },
      ...stepOptions,
    ];
  }, [
    steps,
    stepLabelKey,
    stepStringLabel,
    stepHintKey,
    stepDescriptionKey,
    emptyOption,
    floor,
  ]);

  // Position on the scale, -1 while the field is empty
  const step = value === undefined ? -1 : steps.indexOf(value);

  // A field which cannot be emptied stops at its lowest step
  const isSmallest = emptyOption ? step < 0 : step <= floor;
  const isLargest = step === steps.length - 1;

  // Renders the step's name and the note beside it, in place of
  // the select's own value text
  function renderStep() {
    if (value === undefined) {
      return (
        <span className="designs-scale-field-value">
          <Text size="xs" color="subtle" text={emptyOption?.label} />
        </span>
      );
    }

    return (
      <span className="designs-scale-field-value">
        <Text
          size="xs"
          text={stepLabelKey?.(value)}
          stringText={stepStringLabel?.(value)}
        />
        {stepHintKey && (
          <Text size="xs" color="subtle" text={stepHintKey(value)} />
        )}
      </span>
    );
  }

  // Stepping below the lowest step empties the field, on fields
  // which can be left empty
  function handleDecrease() {
    onChange(step <= floor ? undefined : steps[step - 1]);
  }

  // Stepping up from below the lowest accepted step enters the
  // scale at it, rather than at the bottom of the whole scale
  function handleIncrease() {
    onChange(steps[Math.max(step + 1, floor)]);
  }

  // The empty option clears the value, so the key is deleted
  // rather than set to a sentinel
  function handleValueChange(selected: string | number) {
    onChange(selected === EmptyValue ? undefined : (selected as TStep));
  }

  return (
    <Stack gap={1}>
      {label && <InputLabel size="xs" label={label} />}
      <div className="designs-scale-field-stepper">
        <IconButton
          icon="minus"
          size="sm"
          variant="ghost"
          label={decreaseLabel}
          disabled={isSmallest}
          onClick={handleDecrease}
        />
        <Select
          size="sm"
          variant="ghost"
          className="designs-scale-field-step"
          options={options}
          value={value ?? EmptyValue}
          trigger={renderStep()}
          onValueChange={handleValueChange}
        />
        <IconButton
          icon="plus"
          size="sm"
          variant="ghost"
          label={increaseLabel}
          disabled={isLargest}
          onClick={handleIncrease}
        />
      </div>
    </Stack>
  );
}
