import { DesignElementSettingsControlsProps } from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  RadioToggleHoverMenu,
  RadioToggleHoverMenuOption,
} from '@minddrop/ui-primitives';
import { HeadingElement, HeadingLevel } from '../HeadingElement.types';
import { DefaultHeadingLevel } from '../HeadingElementConfig';

interface HeadingLevelOption {
  /**
   * The level the option selects.
   */
  level: HeadingLevel;

  /**
   * The level as its radio value.
   */
  value: string;

  /**
   * The icon representing the level.
   */
  icon: UiIconName;

  /**
   * i18n key of the level's label.
   */
  label: TranslationKey;
}

// The level options in display order
const HeadingLevelOptions: HeadingLevelOption[] = [
  {
    level: 1,
    value: '1',
    icon: 'heading-1',
    label: 'designsNext.elements.heading.level1',
  },
  {
    level: 2,
    value: '2',
    icon: 'heading-2',
    label: 'designsNext.elements.heading.level2',
  },
  {
    level: 3,
    value: '3',
    icon: 'heading-3',
    label: 'designsNext.elements.heading.level3',
  },
];

/**
 * Renders the heading element's settings controls: the three heading
 * levels behind a trigger showing the current one.
 */
export const HeadingSettingsControls: React.FC<
  DesignElementSettingsControlsProps<HeadingElement>
> = ({ element, onSettingsChange }) => {
  const { t } = useTranslation();

  // The current level as its radio value
  const value = String(element.level ?? DefaultHeadingLevel);

  // The levels as menu options
  const options: RadioToggleHoverMenuOption[] = HeadingLevelOptions.map(
    (option) => ({
      value: option.value,
      icon: option.icon,
      label: t(option.label),
      tooltip: { title: option.label },
    }),
  );

  // Applies the chosen level
  function handleLevelChange(chosenValue: string) {
    // Find the option matching the radio value
    const option = HeadingLevelOptions.find(
      (current) => current.value === chosenValue,
    );

    // Apply the option's level
    if (option) {
      onSettingsChange({ level: option.level });
    }
  }

  return (
    <RadioToggleHoverMenu
      options={options}
      value={value}
      label={t('designsNext.elements.heading.level')}
      onValueChange={handleLevelChange}
    />
  );
};
