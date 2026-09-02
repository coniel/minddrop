import { TranslationKey } from '@minddrop/i18n';
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldRoot,
} from '@minddrop/ui-primitives';
import type { TextSize } from '@minddrop/ui-primitives';
import { TagsCombobox, TagsComboboxProps } from '../TagsCombobox';

export interface TagsSelectFieldProps
  extends Pick<
    TagsComboboxProps,
    'value' | 'onChange' | 'group' | 'variant' | 'size' | 'placeholder'
  > {
  /*
   * Class name applied to the root element.
   */
  className?: string;

  /*
   * Label text. Can be an i18n key.
   */
  label?: TranslationKey;

  /*
   * Size of the label text.
   * @default 'sm'
   */
  labelSize?: TextSize;

  /*
   * Helper text displayed below the field.
   * Hidden when error is present.
   * Can be an i18n key.
   */
  description?: TranslationKey;

  /*
   * Error message. Also sets the field to invalid state.
   * Can be an i18n key.
   */
  error?: TranslationKey;
}

/**
 * Renders a multi value tag picker with an optional label,
 * description, and error message.
 */
export const TagsSelectField: React.FC<TagsSelectFieldProps> = ({
  className,
  label,
  labelSize,
  description,
  error,
  ...comboboxProps
}) => {
  return (
    <FieldRoot className={className} invalid={!!error}>
      {label && <FieldLabel size={labelSize} label={label} />}

      <TagsCombobox {...comboboxProps} />

      {description && !error && <FieldDescription description={description} />}
      {error && <FieldError error={error} />}
    </FieldRoot>
  );
};
