import {
  DesignElement,
  DesignElementSettingControlProps,
  DesignElementSettings,
  Designs,
  ElementColor,
} from '@minddrop/designs-next';
import { ElementColorControl } from './ElementColorControl';

/**
 * Renders the picker for the colour text is drawn in.
 */
export const TextColorControl: React.FC<
  DesignElementSettingControlProps<DesignElement & DesignElementSettings>
> = ({ element, onChange }) => {
  // The colour the text is drawn in, the default without one
  const value = element.textColor ?? Designs.constants.DefaultTextColor;

  // Sets the colour the text is drawn in
  function handleValueChange(textColor: ElementColor) {
    onChange({ textColor });
  }

  return (
    <ElementColorControl
      label="designsNext.settings.textColor.label"
      value={value}
      onValueChange={handleValueChange}
    />
  );
};
