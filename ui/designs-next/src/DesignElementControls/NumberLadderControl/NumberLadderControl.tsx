import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import { Icon, ToolbarHoverPanel } from '@minddrop/ui-primitives';
import { NumberLadder } from '../NumberLadder';
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
      <NumberLadder
        label={label}
        options={ladder.map((ladderValue) => ({
          value: ladderValue,
          label: String(ladderValue),
        }))}
        columns={LadderColumns}
        value={value}
        min={min}
        max={max}
        step={step}
        decimals={decimals}
        onValueChange={onValueChange}
      />
    </ToolbarHoverPanel>
  );
};
