import {
  DesignElement,
  DesignElementSettings,
  DesignElementSettingsMenuProps,
} from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import { Toggle } from '@minddrop/ui-primitives';

/**
 * Renders the text setting group: bold and italic toggles.
 */
export const TextSettingsGroup: React.FC<
  DesignElementSettingsMenuProps<DesignElement & DesignElementSettings>
> = ({ element, onSettingsChange }) => {
  const { t } = useTranslation();

  return (
    <>
      <Toggle
        icon="bold"
        label={t('designsNext.settings.bold')}
        pressed={Boolean(element.bold)}
        onPressedChange={(pressed) => onSettingsChange({ bold: pressed })}
        tooltip={{ side: 'top', title: 'designsNext.settings.bold' }}
      />
      <Toggle
        icon="italic"
        label={t('designsNext.settings.italic')}
        pressed={Boolean(element.italic)}
        onPressedChange={(pressed) => onSettingsChange({ italic: pressed })}
        tooltip={{ side: 'top', title: 'designsNext.settings.italic' }}
      />
    </>
  );
};
