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
import { ElementColorControl } from './ElementColorControl';
import { FontControl, FontSettings } from './FontControl';
import { FontWeightMenu } from './FontWeightMenu';
import { NumberLadderControl } from './NumberLadderControl';
import { TextAlignMenu } from './TextAlignMenu';
import { VerticalAlignMenu } from './VerticalAlignMenu';

/**
 * Renders the text setting group: the font, size, line height,
 * weight, alignment and colour controls.
 */
export const TextSettingsGroup: React.FC<
  DesignElementSettingsControlsProps<DesignElement & DesignElementSettings>
> = ({ element, onSettingsChange }) => {
  // The family, size, line height, alignments and colour falling
  // back to the element defaults.
  const fontFamily = element.fontFamily ?? 'sans';
  const fontSize = element.fontSize ?? Designs.constants.DefaultFontSize;
  const lineHeight = element.lineHeight ?? Designs.constants.DefaultLineHeight;
  const textAlign = element.textAlign ?? 'left';
  const verticalAlign = element.verticalAlign ?? 'top';
  const textColor = element.textColor ?? Designs.constants.DefaultTextColor;

  // Sets the font the text is set in
  function handleFontChange(settings: FontSettings) {
    onSettingsChange(settings);
  }

  // Sets the size the text is set at
  function handleFontSizeChange(fontSize: number) {
    onSettingsChange({ fontSize });
  }

  // Sets the height of the text's lines
  function handleLineHeightChange(lineHeight: number) {
    onSettingsChange({ lineHeight });
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
      <FontControl
        fontFamily={fontFamily}
        italic={Boolean(element.italic)}
        underline={Boolean(element.underline)}
        strikethrough={Boolean(element.strikethrough)}
        onSettingsChange={handleFontChange}
      />
      <NumberLadderControl
        label="designsNext.settings.fontSize.label"
        value={fontSize}
        ladder={Designs.constants.FontSizes}
        min={Designs.constants.MinFontSize}
        max={Designs.constants.MaxFontSize}
        onValueChange={handleFontSizeChange}
      />
      <NumberLadderControl
        label="designsNext.settings.lineHeight.label"
        icon="list-chevrons-up-down"
        value={lineHeight}
        ladder={Designs.constants.LineHeights}
        min={Designs.constants.MinLineHeight}
        max={Designs.constants.MaxLineHeight}
        step={Designs.constants.LineHeightStep}
        decimals={2}
        onValueChange={handleLineHeightChange}
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
