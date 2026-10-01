import { TranslationKey } from '@minddrop/i18n';
import {
  InputLabel,
  NumberField,
  RadioToggleGroup,
  Stack,
  Toggle,
  joinClasses,
} from '@minddrop/ui-primitives';

export interface NumberLadderOption {
  /**
   * The value the option sets.
   */
  value: number;

  /**
   * The option's accessible label.
   */
  label: string;

  /**
   * What the option shows in place of its label.
   */
  content?: React.ReactNode;
}

export interface NumberLadderProps {
  /**
   * The conventional values offered on the ladder, in order.
   */
  options: NumberLadderOption[];

  /**
   * The values a row of the ladder holds.
   */
  columns: number;

  /**
   * The current value.
   */
  value: number;

  /**
   * The smallest value the field accepts.
   */
  min: number;

  /**
   * The largest value the field accepts.
   */
  max: number;

  /**
   * i18n key of the label above the ladder. Omitted when the
   * surrounding UI already names what it sets.
   */
  label?: TranslationKey;

  /**
   * Hides the custom field's label. Assistive technology still reads
   * it. Used when the ladder's own label names what both set.
   */
  hideCustomLabel?: boolean;

  /**
   * The amount the field steps by.
   * @default 1
   */
  step?: number;

  /**
   * The decimal places the field keeps.
   */
  decimals?: number;

  /**
   * Callback fired with the chosen value.
   */
  onValueChange: (value: number) => void;

  /**
   * Class name applied to the ladder.
   */
  className?: string;
}

/**
 * Renders a ladder of a number's conventional values with a stepper
 * field beneath it for any other.
 */
export const NumberLadder: React.FC<NumberLadderProps> = ({
  options,
  columns,
  value,
  min,
  max,
  label,
  hideCustomLabel = false,
  step,
  decimals,
  onValueChange,
  className,
}) => {
  // Set inline so the column count overrides the toggle group's
  // own single row.
  const ladderLayout: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
  };

  // Sets a ladder value
  function handleLadderChange(chosenValue: string) {
    onValueChange(Number(chosenValue));
  }

  // Sets a value off the ladder. Clearing the field leaves the
  // value as it is.
  function handleCustomValueChange(customValue: number | null) {
    if (customValue !== null) {
      onValueChange(customValue);
    }
  }

  return (
    <Stack gap={3} className={joinClasses('design-number-ladder', className)}>
      <Stack gap={1}>
        {label && <InputLabel size="xs" label={label} />}
        <RadioToggleGroup
          size="sm"
          value={String(value)}
          style={ladderLayout}
          onValueChange={handleLadderChange}
        >
          {options.map((option) => (
            <Toggle
              key={option.value}
              size="sm"
              value={String(option.value)}
              label={option.label}
            >
              {option.content}
            </Toggle>
          ))}
        </RadioToggleGroup>
      </Stack>
      <NumberField
        size="sm"
        variant="subtle"
        stepper="ends"
        label="designsNext.settings.custom"
        labelSize="xs"
        hideLabel={hideCustomLabel}
        value={value}
        min={min}
        max={max}
        step={step}
        decimals={decimals}
        onValueChange={handleCustomValueChange}
      />
    </Stack>
  );
};
