import {
  DesignElement,
  DesignElementSettingControlProps,
  DesignElementSettings,
  VerticalAlign,
} from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  RadioToggleHoverMenu,
  RadioToggleHoverMenuOption,
} from '@minddrop/ui-primitives';

interface VerticalAlignOption {
  /**
   * The alignment the option selects.
   */
  value: VerticalAlign;

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
const VerticalAlignOptions: VerticalAlignOption[] = [
  {
    value: 'top',
    icon: 'align-start-horizontal',
    label: 'designsNext.settings.verticalAlign.top',
  },
  {
    value: 'middle',
    icon: 'align-center-horizontal',
    label: 'designsNext.settings.verticalAlign.middle',
  },
  {
    value: 'bottom',
    icon: 'align-end-horizontal',
    label: 'designsNext.settings.verticalAlign.bottom',
  },
];

/**
 * Renders the picker for the edge of its block text sits against
 * as the hover menu the pins use, each option drawing its
 * alignment.
 */
export const VerticalAlignMenu: React.FC<
  DesignElementSettingControlProps<DesignElement & DesignElementSettings>
> = ({ element, onChange }) => {
  const { t } = useTranslation();

  // The edge of its block the text sits against, the top one by
  // default.
  const value = element.verticalAlign ?? 'top';

  // Applies the chosen alignment
  function handleValueChange(verticalAlign: VerticalAlign) {
    onChange({ verticalAlign });
  }

  // The alignments as menu options
  const options: RadioToggleHoverMenuOption<VerticalAlign>[] =
    VerticalAlignOptions.map((option) => ({
      value: option.value,
      icon: option.icon,
      label: t(option.label),
      tooltip: { title: option.label },
    }));

  return (
    <RadioToggleHoverMenu<VerticalAlign>
      options={options}
      value={value}
      label={t('designsNext.settings.verticalAlign.label')}
      onValueChange={handleValueChange}
    />
  );
};
