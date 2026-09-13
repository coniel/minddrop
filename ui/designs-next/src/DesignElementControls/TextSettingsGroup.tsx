import {
  DesignElement,
  DesignElementSettings,
  DesignElementSettingsControlsProps,
  Designs,
  ElementColor,
  FontWeight,
  TextAlign,
  VerticalAlign,
} from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import { Toggle } from '@minddrop/ui-primitives';
import { BlockControlOffset } from '../constants';
import { ElementColorControl } from './ElementColorControl';
import { FontSizeControl } from './FontSizeControl';
import { FontWeightMenu } from './FontWeightMenu';
import { TextAlignMenu } from './TextAlignMenu';
import { VerticalAlignMenu } from './VerticalAlignMenu';

/**
 * Renders the text setting group: the size, weight, italic,
 * alignment and colour controls.
 */
export const TextSettingsGroup: React.FC<
  DesignElementSettingsControlsProps<DesignElement & DesignElementSettings>
> = ({ element, onSettingsChange }) => {
  const { t } = useTranslation();

  // The size, alignments and colour falling back to the element
  // defaults.
  const fontSize = element.fontSize ?? Designs.constants.DefaultFontSize;
  const textAlign = element.textAlign ?? 'left';
  const verticalAlign = element.verticalAlign ?? 'top';
  const textColor = element.textColor ?? Designs.constants.DefaultTextColor;

  // Sets the size the text is set at
  function handleFontSizeChange(fontSize: number) {
    onSettingsChange({ fontSize });
  }

  // Sets the weight the text is drawn at
  function handleFontWeightChange(fontWeight: FontWeight | undefined) {
    onSettingsChange({ fontWeight });
  }

  // Sets the edge the text lines up on
  function handleTextAlignChange(textAlign: TextAlign) {
    onSettingsChange({ textAlign });
  }

  // Sets the edge of its block the text sits against
  function handleVerticalAlignChange(verticalAlign: VerticalAlign) {
    onSettingsChange({ verticalAlign });
  }

  // Sets the colour the text is drawn in
  function handleTextColorChange(textColor: ElementColor) {
    onSettingsChange({ textColor });
  }

  return (
    <>
      <FontSizeControl value={fontSize} onValueChange={handleFontSizeChange} />
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
      <VerticalAlignMenu
        value={verticalAlign}
        onValueChange={handleVerticalAlignChange}
      />
      <ElementColorControl
        label="designsNext.settings.textColor.label"
        value={textColor}
        onValueChange={handleTextColorChange}
      />
    </>
  );
};
