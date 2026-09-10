import {
  DesignElement,
  DesignElementSettings,
  DesignElementSettingsControlsProps,
  FontWeight,
  TextAlign,
} from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import { Toggle } from '@minddrop/ui-primitives';
import { BlockControlOffset } from '../constants';
import { FontWeightMenu } from './FontWeightMenu';
import { TextAlignMenu } from './TextAlignMenu';

/**
 * Renders the text setting group: the font weight menu, the italic
 * toggle and the alignment menu.
 */
export const TextSettingsGroup: React.FC<
  DesignElementSettingsControlsProps<DesignElement & DesignElementSettings>
> = ({ element, onSettingsChange }) => {
  const { t } = useTranslation();

  // The alignment falling back to the element default
  const textAlign = element.textAlign ?? 'left';

  // Sets the weight the text is drawn at
  function handleFontWeightChange(fontWeight: FontWeight | undefined) {
    onSettingsChange({ fontWeight });
  }

  // Sets the edge the text lines up on
  function handleTextAlignChange(textAlign: TextAlign) {
    onSettingsChange({ textAlign });
  }

  return (
    <>
      <FontWeightMenu
        value={element.fontWeight}
        onValueChange={handleFontWeightChange}
      />
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
      <TextAlignMenu value={textAlign} onValueChange={handleTextAlignChange} />
    </>
  );
};
