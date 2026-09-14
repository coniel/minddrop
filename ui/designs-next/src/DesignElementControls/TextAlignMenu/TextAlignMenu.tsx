import {
  DesignElement,
  DesignElementSettingControlProps,
  DesignElementSettings,
  TextAlign,
} from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  RadioToggleHoverMenu,
  RadioToggleHoverMenuOption,
} from '@minddrop/ui-primitives';

interface TextAlignOption {
  /**
   * The alignment the option selects.
   */
  value: TextAlign;

  /**
   * The icon drawing the alignment.
   */
  icon: UiIconName;

  /**
   * i18n key of the alignment's label.
   */
  label: TranslationKey;
}

// The alignment options in display order
const TextAlignOptions: TextAlignOption[] = [
  {
    value: 'left',
    icon: 'align-left',
    label: 'designsNext.settings.textAlign.left',
  },
  {
    value: 'center',
    icon: 'align-center',
    label: 'designsNext.settings.textAlign.center',
  },
  {
    value: 'right',
    icon: 'align-right',
    label: 'designsNext.settings.textAlign.right',
  },
  {
    value: 'justify',
    icon: 'align-justify',
    label: 'designsNext.settings.textAlign.justify',
  },
];

/**
 * Renders the picker for the edge text lines up on as the hover
 * menu the pins use, each option drawing its alignment.
 */
export const TextAlignMenu: React.FC<
  DesignElementSettingControlProps<DesignElement & DesignElementSettings>
> = ({ element, onChange }) => {
  const { t } = useTranslation();

  // The edge the text lines up on, the left one by default
  const value = element.textAlign ?? 'left';

  // Applies the chosen alignment
  function handleValueChange(textAlign: TextAlign) {
    onChange({ textAlign });
  }

  // The alignments as menu options
  const options: RadioToggleHoverMenuOption<TextAlign>[] = TextAlignOptions.map(
    (option) => ({
      value: option.value,
      icon: option.icon,
      label: t(option.label),
      tooltip: { title: option.label },
    }),
  );

  return (
    <RadioToggleHoverMenu<TextAlign>
      options={options}
      value={value}
      label={t('designsNext.settings.textAlign.label')}
      onValueChange={handleValueChange}
    />
  );
};
