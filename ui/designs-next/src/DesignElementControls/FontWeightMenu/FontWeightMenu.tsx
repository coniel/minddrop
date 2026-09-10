import { Designs, FontWeight } from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import {
  RadioToggleHoverMenu,
  RadioToggleHoverMenuOption,
} from '@minddrop/ui-primitives';
import './FontWeightMenu.css';

export interface FontWeightMenuProps {
  /**
   * The weight the text is set in, or undefined when it is left at
   * the element's own.
   */
  value?: FontWeight;

  /**
   * Callback fired with the chosen weight, or undefined when the
   * default option is chosen.
   */
  onValueChange: (fontWeight: FontWeight | undefined) => void;
}

// The value of the option leaving the weight to the element
const DefaultValue = 'default';

// The options a row holds, splitting the scale and its default
// option across two.
const MenuColumns = 5;

// The name of each weight on the scale
const FontWeightLabels: Record<FontWeight, TranslationKey> = {
  100: 'designsNext.settings.fontWeight.thin',
  200: 'designsNext.settings.fontWeight.extraLight',
  300: 'designsNext.settings.fontWeight.light',
  400: 'designsNext.settings.fontWeight.regular',
  500: 'designsNext.settings.fontWeight.medium',
  600: 'designsNext.settings.fontWeight.semibold',
  700: 'designsNext.settings.fontWeight.bold',
  800: 'designsNext.settings.fontWeight.extraBold',
  900: 'designsNext.settings.fontWeight.black',
};

/**
 * Renders the picker for the weight text is set in as the hover
 * menu the pins use: each weight an A drawn in it, numbered
 * beneath.
 */
export const FontWeightMenu: React.FC<FontWeightMenuProps> = ({
  value,
  onValueChange,
}) => {
  const { t } = useTranslation();

  // The default option, followed by the scale
  const options: RadioToggleHoverMenuOption[] = [
    {
      value: DefaultValue,
      label: t('designsNext.settings.fontWeight.default'),
      tooltip: { title: 'designsNext.settings.fontWeight.default' },
      content: (
        <span className="design-font-weight-option">
          <span className="design-font-weight-option-letter">A</span>
          <span className="design-font-weight-option-value">&mdash;</span>
        </span>
      ),
    },
    ...Designs.constants.FontWeights.map(resolveWeightOption),
  ];

  // Applies the chosen weight, the default option clearing it
  function handleValueChange(chosenValue: string) {
    onValueChange(
      chosenValue === DefaultValue
        ? undefined
        : (Number(chosenValue) as FontWeight),
    );
  }

  // Builds a weight's option: an A drawn in the weight, numbered
  // beneath it.
  function resolveWeightOption(
    fontWeight: FontWeight,
  ): RadioToggleHoverMenuOption {
    return {
      value: String(fontWeight),
      label: t(FontWeightLabels[fontWeight]),
      tooltip: { title: FontWeightLabels[fontWeight] },
      content: (
        <span className="design-font-weight-option">
          <span
            className="design-font-weight-option-letter"
            style={{ fontWeight }}
          >
            A
          </span>
          <span className="design-font-weight-option-value">{fontWeight}</span>
        </span>
      ),
    };
  }

  return (
    <RadioToggleHoverMenu
      options={options}
      columns={MenuColumns}
      value={value ? String(value) : DefaultValue}
      label={t('designsNext.settings.fontWeight.label')}
      onValueChange={handleValueChange}
    />
  );
};
