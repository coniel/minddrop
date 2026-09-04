import { DesignElementSettingsMenuProps } from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import { RadioToggleGroup, Toggle } from '@minddrop/ui-primitives';
import { HeadingElement, HeadingLevel } from './HeadingElement.types';
import { DefaultHeadingLevel } from './HeadingElementConfig';

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
 * Renders the heading element's settings menu: radio toggles over
 * the three heading levels.
 */
export const HeadingSettingsMenu: React.FC<
  DesignElementSettingsMenuProps<HeadingElement>
> = ({ element, onSettingsChange }) => {
  const { t } = useTranslation();

  // The current level as its radio value
  const value = String(element.level ?? DefaultHeadingLevel);

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
    <RadioToggleGroup value={value} onValueChange={handleLevelChange}>
      {HeadingLevelOptions.map((option) => (
        <Toggle
          key={option.value}
          value={option.value}
          icon={option.icon}
          label={t(option.label)}
          tooltip={{ side: 'top', title: option.label }}
        />
      ))}
    </RadioToggleGroup>
  );
};
