import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  Icon,
  InputLabel,
  NumberField,
  RadioToggleGroup,
  Stack,
  Toggle,
  ToolbarHoverPanel,
} from '@minddrop/ui-primitives';
import './NumberLadderControl.css';

export interface NumberLadderControlProps {
  /**
   * i18n key of the control's label, naming what it sets. Labels
   * the trigger and heads the ladder.
   */
  label: TranslationKey;

  /**
   * The icon shown on the trigger. Omitted for a trigger showing
   * the value itself.
   */
  icon?: UiIconName;

  /**
   * The current value.
   */
  value: number;

  /**
   * The conventional values offered on the ladder, in order.
   */
  ladder: number[];

  /**
   * The smallest value the field accepts.
   */
  min: number;

  /**
   * The largest value the field accepts.
   */
  max: number;

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
}

// The values a row of the ladder holds
const LadderColumns = 4;

/**
 * The ladder grid. Laid out inline so the column count wins over
 * the group's own single row.
 */
const LadderLayout: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `repeat(${LadderColumns}, auto)`,
};

/**
 * Renders a picker for a number opened out of the toolbar: a
 * ladder of its conventional values with a stepper field beneath
 * it for any other. The trigger shows its icon, or the value it
 * sets without one.
 */
export const NumberLadderControl: React.FC<NumberLadderControlProps> = ({
  label,
  icon,
  value,
  ladder,
  min,
  max,
  step,
  decimals,
  onValueChange,
}) => {
  const { t } = useTranslation();

  // Sets a ladder value
  function handleLadderChange(chosenValue: string) {
    onValueChange(Number(chosenValue));
  }

  // Sets a value off the ladder, a cleared field leaving the value
  // as it is.
  function handleCustomValueChange(customValue: number | null) {
    if (customValue !== null) {
      onValueChange(customValue);
    }
  }

  return (
    <ToolbarHoverPanel
      label={t(label)}
      trigger={
        icon ? (
          <Icon name={icon} />
        ) : (
          <span className="design-number-ladder-control-value">{value}</span>
        )
      }
    >
      <Stack gap={3} className="design-number-ladder-control-panel">
        <Stack gap={1}>
          <InputLabel size="xs" label={label} />
          <RadioToggleGroup
            size="sm"
            value={String(value)}
            style={LadderLayout}
            onValueChange={handleLadderChange}
          >
            {ladder.map((ladderValue) => (
              <Toggle
                key={ladderValue}
                size="sm"
                value={String(ladderValue)}
                label={String(ladderValue)}
              />
            ))}
          </RadioToggleGroup>
        </Stack>
        <NumberField
          size="sm"
          variant="subtle"
          stepper="ends"
          label="designsNext.settings.custom"
          labelSize="xs"
          value={value}
          min={min}
          max={max}
          step={step}
          decimals={decimals}
          onValueChange={handleCustomValueChange}
        />
      </Stack>
    </ToolbarHoverPanel>
  );
};
