import {
  DesignElement,
  DesignElementSettings,
  DesignElementSettingsControlsProps,
  FontWeight,
} from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import { Toggle } from '@minddrop/ui-primitives';
import { BlockControlOffset } from '../constants';
import { FontWeightMenu } from './FontWeightMenu';

/**
 * Renders the text setting group: the font weight menu and the
 * italic toggle.
 */
export const TextSettingsGroup: React.FC<
  DesignElementSettingsControlsProps<DesignElement & DesignElementSettings>
> = ({ element, onSettingsChange }) => {
  const { t } = useTranslation();

  // Sets the weight the text is drawn at
  function handleFontWeightChange(fontWeight: FontWeight | undefined) {
    onSettingsChange({ fontWeight });
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
    </>
  );
};
