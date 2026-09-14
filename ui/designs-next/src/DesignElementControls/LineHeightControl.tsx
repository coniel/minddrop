import {
  DesignElement,
  DesignElementSettingControlProps,
  DesignElementSettings,
  Designs,
} from '@minddrop/designs-next';
import { NumberLadderControl } from './NumberLadderControl';

/**
 * Renders the picker for the height of the text's lines: the ladder
 * of heights with a number field beneath it.
 */
export const LineHeightControl: React.FC<
  DesignElementSettingControlProps<DesignElement & DesignElementSettings>
> = ({ element, onChange }) => {
  // The height of the text's lines, the default without one
  const value = element.lineHeight ?? Designs.constants.DefaultLineHeight;

  // Sets the height of the text's lines
  function handleValueChange(lineHeight: number) {
    onChange({ lineHeight });
  }

  return (
    <NumberLadderControl
      label="designsNext.settings.lineHeight.label"
      icon="list-chevrons-up-down"
      value={value}
      ladder={Designs.constants.LineHeights}
      min={Designs.constants.MinLineHeight}
      max={Designs.constants.MaxLineHeight}
      step={Designs.constants.LineHeightStep}
      decimals={2}
      onValueChange={handleValueChange}
    />
  );
};
