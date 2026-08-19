import { HeightValue, SizeTokens } from '@minddrop/designs';
import { SelectField, SelectOption } from '@minddrop/ui-primitives';
import { fieldLabelKey, sizeHintKey, sizeOptionKey } from './styleI18nKeys';

// Value used by the "auto" option, since a select cannot carry
// undefined as an option value
const UnsetValue = '__unset__';

export interface HeightFieldProps {
  /**
   * The current height, or undefined when the style key is not
   * set.
   */
  value: HeightValue | undefined;

  /**
   * Called with the chosen height, or undefined when cleared.
   */
  onChange: (value: HeightValue | undefined) => void;
}

/**
 * Renders the element height select, which mixes the fill keyword
 * with the fixed box sizes. Fill is what makes a full-page embed
 * take the space left beside a header.
 */
export const HeightField: React.FC<HeightFieldProps> = ({
  value,
  onChange,
}) => {
  // Clear the key when "auto" is chosen
  function handleValueChange(selected: string | number) {
    if (selected === UnsetValue) {
      onChange(undefined);

      return;
    }

    onChange(selected as HeightValue);
  }

  return (
    <SelectField
      size="sm"
      variant="subtle"
      label={fieldLabelKey('height')}
      labelSize="xs"
      options={buildHeightOptions()}
      value={value ?? UnsetValue}
      onValueChange={handleValueChange}
    />
  );
};

/**
 * Builds the height options: content-sized "auto", the fill
 * keyword, then the fixed box sizes.
 */
function buildHeightOptions(): SelectOption<string>[] {
  const sizeOptions: SelectOption<string>[] = SizeTokens.map((token) => ({
    value: token,
    label: sizeOptionKey(token, 'label'),
    hint: sizeHintKey(token),
  }));

  return [
    { value: UnsetValue, label: 'designsStudio.style.height.auto.label' },
    { value: 'fill', label: 'designsStudio.style.height.fill.label' },
    ...sizeOptions,
  ];
}
