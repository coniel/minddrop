import { TranslationKey, useTranslation } from '@minddrop/i18n';
import {
  InputLabel,
  RadioToggleGroup,
  Stack,
  Toggle,
} from '@minddrop/ui-primitives';
import './VariantOptionsField.css';

export interface VariantOption {
  /**
   * The variant identifier the option selects.
   */
  id: string;

  /**
   * The i18n key of the option's label.
   */
  label: TranslationKey;

  /**
   * The i18n key of a short line explaining what the variant
   * renders, for variants a sample cannot speak for.
   */
  description?: TranslationKey;

  /**
   * A sample previewing the variant's rendering.
   */
  sample?: React.ReactNode;
}

export interface VariantOptionsFieldProps {
  /**
   * The i18n key of the field label. Omitted on fields whose
   * surroundings already name them.
   */
  label?: TranslationKey;

  /**
   * The variant options, in display order.
   */
  options: VariantOption[];

  /**
   * The selected variant ID.
   */
  value: string;

  /**
   * Called with the chosen variant ID.
   */
  onValueChange: (value: string) => void;
}

/**
 * Renders a variant radio list: one option per variant, its name
 * above a description or a sample previewing the variant's
 * rendering. The shared picker UI behind the element presentation
 * variants and the chrome variant fields.
 */
export const VariantOptionsField: React.FC<VariantOptionsFieldProps> = ({
  label,
  options,
  value,
  onValueChange,
}) => {
  const { t } = useTranslation();

  return (
    <Stack gap={1}>
      {/** The field label, when the field is not self-naming **/}
      {label && <InputLabel size="xs" label={label} />}

      <RadioToggleGroup
        className="designs-variant-options"
        value={value}
        onValueChange={onValueChange}
      >
        {options.map((option) => (
          <Toggle
            key={option.id}
            value={option.id}
            label={t(option.label)}
            className="designs-variant-option"
          >
            <div className="designs-variant-option-content">
              {/** The variant's name **/}
              <InputLabel size="xs" label={option.label} />

              {/** What the variant renders, for variants a sample
               * cannot speak for **/}
              {option.description && (
                <span className="designs-variant-option-description">
                  {t(option.description)}
                </span>
              )}

              {/** A sample previewing the variant's rendering **/}
              {option.sample}
            </div>
          </Toggle>
        ))}
      </RadioToggleGroup>
    </Stack>
  );
};
