import {
  DesignElement,
  DesignElementSettings,
  DesignElementSettingsControlsProps,
  Designs,
  ElementColor,
  FontWeight,
  TextAlign,
} from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import { Toggle } from '@minddrop/ui-primitives';
import { BlockControlOffset } from '../constants';
import { ElementColorControl } from './ElementColorControl';
import { FontWeightMenu } from './FontWeightMenu';
import { TextAlignMenu } from './TextAlignMenu';

/**
 * Renders the text setting group: the italic toggle, the font
 * weight menu, the alignment menu and the colour control.
 */
export const TextSettingsGroup: React.FC<
  DesignElementSettingsControlsProps<DesignElement & DesignElementSettings>
> = ({ element, onSettingsChange }) => {
  const { t } = useTranslation();

  // The alignment and colour falling back to the element defaults
  const textAlign = element.textAlign ?? 'left';
  const textColor = element.textColor ?? Designs.constants.DefaultTextColor;

  // Sets the weight the text is drawn at
  function handleFontWeightChange(fontWeight: FontWeight | undefined) {
    onSettingsChange({ fontWeight });
  }

  // Sets the edge the text lines up on
  function handleTextAlignChange(textAlign: TextAlign) {
    onSettingsChange({ textAlign });
  }

  // Sets the colour the text is drawn in
  function handleTextColorChange(textColor: ElementColor) {
    onSettingsChange({ textColor });
  }

  return (
    <>
      <Toggle
        icon="italic"
        label={t('designsNext.settings.italic')}
        pressed={Boolean(element.italic)}
        onPressedChange={(pressed) => onSettingsChange({ italic: pressed })}
        tooltip={{
          side: 'right',
          sideOffset: BlockControlOffset,
          title: 'designsNext.settings.italic',
        }}
      />
      <FontWeightMenu
        value={element.fontWeight}
        onValueChange={handleFontWeightChange}
      />
      <TextAlignMenu value={textAlign} onValueChange={handleTextAlignChange} />
      <ElementColorControl
        label="designsNext.settings.textColor.label"
        value={textColor}
        onValueChange={handleTextColorChange}
      />
    </>
  );
};
