import {
  DesignElement,
  DesignElementSettingControlProps,
  DesignElementSettings,
  Designs,
} from '@minddrop/designs-next';
import { NumberLadderControl } from './NumberLadderControl';

/**
 * Renders the picker for the size text is set at: the ladder of
 * sizes with a number field beneath it.
 */
export const FontSizeControl: React.FC<
  DesignElementSettingControlProps<DesignElement & DesignElementSettings>
> = ({ element, onChange }) => {
  // The size the text is set at, the default size without one
  const value = element.fontSize ?? Designs.constants.DefaultFontSize;

  // Sets the size the text is set at
  function handleValueChange(fontSize: number) {
    onChange({ fontSize });
  }

  return (
    <NumberLadderControl
      label="designsNext.settings.fontSize.label"
      value={value}
      ladder={Designs.constants.FontSizes}
      min={Designs.constants.MinFontSize}
      max={Designs.constants.MaxFontSize}
      onValueChange={handleValueChange}
    />
  );
};
