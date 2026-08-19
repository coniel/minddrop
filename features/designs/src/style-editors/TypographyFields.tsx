import {
  FontFamilyToken,
  FontFamilyTokens,
  FontSizeToken,
  FontWeightToken,
  FontWeightTokens,
  LetterSpacingToken,
  LetterSpacingTokens,
  LineHeightToken,
  LineHeightTokens,
  TextAlign,
  TextColorToken,
  TextColorTokens,
  TextTransform,
} from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { FlexItem, Group, Stack, Toggle } from '@minddrop/ui-primitives';
import {
  OptionToggleField,
  OptionToggleFieldOption,
} from './OptionToggleField';
import { TokenSelect } from './TokenSelect';
import { TruncateField } from './TruncateField';
import {
  fieldLabelKey,
  fontFamilyOptionKey,
  fontSizeOptionKey,
  fontWeightOptionKey,
  letterSpacingOptionKey,
  lineHeightOptionKey,
  textColourOptionKey,
} from './styleI18nKeys';

// The alignment options, in reading order
const TextAlignOptions: OptionToggleFieldOption<TextAlign>[] = [
  {
    value: 'left',
    label: 'designsStudio.style.textAlign.left',
    icon: 'align-left',
  },
  {
    value: 'center',
    label: 'designsStudio.style.textAlign.center',
    icon: 'align-center',
  },
  {
    value: 'right',
    label: 'designsStudio.style.textAlign.right',
    icon: 'align-right',
  },
  {
    value: 'justify',
    label: 'designsStudio.style.textAlign.justify',
    icon: 'align-justify',
  },
];

// The sizes offered for hand-picked text. The scale's numbered
// extremes stay reserved for role styling, keeping the select to
// a readable handful
const FontSizeOptions: readonly FontSizeToken[] = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
];

// The capitalisation options, shown as letter-pair samples. The
// as-is option stands in for an unset value, since a radio group
// offers no deselection
export const TextTransformOptions: OptionToggleFieldOption<
  TextTransform | 'none'
>[] = [
  {
    value: 'none',
    label: 'designsStudio.style.textTransform.none',
  },
  {
    value: 'uppercase',
    label: 'designsStudio.style.textTransform.uppercase',
    display: 'designsStudio.style.textTransform.uppercaseShort',
  },
  {
    value: 'lowercase',
    label: 'designsStudio.style.textTransform.lowercase',
    display: 'designsStudio.style.textTransform.lowercaseShort',
  },
  {
    value: 'capitalize',
    label: 'designsStudio.style.textTransform.capitalize',
    display: 'designsStudio.style.textTransform.capitalizeShort',
  },
];

/**
 * The style keys the type block writes to, in the order the
 * fields are rendered.
 */
export const TypographyStyleKeys: string[] = [
  'fontFamily',
  'fontWeight',
  'italic',
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'color',
  'textAlign',
  'textTransform',
  'truncate',
];

export interface TypographyFieldsProps {
  /**
   * Whether a style key is editable, meaning the element's role
   * does not control it.
   */
  isEditable: (key: string) => boolean;

  /**
   * Reads a style value.
   */
  getValue: <TValue>(key: string) => TValue | undefined;

  /**
   * Writes a style value, clearing the key when undefined.
   */
  setValue: (key: string, value: unknown) => void;

  /**
   * Whether to offer the line truncation field. Hidden where a
   * line limit makes no sense, such as an editor's title bar.
   */
  showTruncate?: boolean;
}

/**
 * Renders the type controls shared by every text-rendering style:
 * the type scale, colour, alignment and emphasis. Used both for
 * text elements and for the nested title of a content editor.
 */
export const TypographyFields: React.FC<TypographyFieldsProps> = ({
  isEditable,
  getValue,
  setValue,
  showTruncate = true,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {/** The font cluster: the family select above a row pairing
       * the weight select with the italic toggle **/}
      {(isEditable('fontFamily') ||
        isEditable('fontWeight') ||
        isEditable('italic')) && (
        <Stack gap={1}>
          {isEditable('fontFamily') && (
            <TokenSelect
              label={fieldLabelKey('fontFamily')}
              tokens={FontFamilyTokens}
              value={getValue<FontFamilyToken>('fontFamily')}
              optionKey={fontFamilyOptionKey}
              clearOption={{
                label: 'designsStudio.style.defaultFont.label',
                description: 'designsStudio.style.defaultFont.description',
              }}
              onChange={(value) => setValue('fontFamily', value)}
            />
          )}
          {(isEditable('fontWeight') || isEditable('italic')) && (
            <Group gap={1} align="end">
              {isEditable('fontWeight') && (
                <FlexItem grow={1}>
                  <TokenSelect
                    label={fieldLabelKey('fontWeight')}
                    tokens={FontWeightTokens}
                    value={getValue<FontWeightToken>('fontWeight')}
                    optionKey={fontWeightOptionKey}
                    defaultToken="regular"
                    onChange={(value) => setValue('fontWeight', value)}
                  />
                </FlexItem>
              )}
              {isEditable('italic') && (
                <Toggle
                  size="sm"
                  icon="italic"
                  label={t(fieldLabelKey('italic'))}
                  pressed={getValue<boolean>('italic') ?? false}
                  onPressedChange={(pressed) =>
                    setValue('italic', pressed ? true : undefined)
                  }
                />
              )}
            </Group>
          )}
        </Stack>
      )}
      {isEditable('fontSize') && (
        <TokenSelect
          label={fieldLabelKey('fontSize')}
          tokens={FontSizeOptions}
          value={getValue<FontSizeToken>('fontSize')}
          optionKey={fontSizeOptionKey}
          onChange={(value) => setValue('fontSize', value)}
        />
      )}
      {isEditable('lineHeight') && (
        <TokenSelect
          label={fieldLabelKey('lineHeight')}
          tokens={LineHeightTokens}
          value={getValue<LineHeightToken>('lineHeight')}
          optionKey={lineHeightOptionKey}
          defaultToken="snug"
          onChange={(value) => setValue('lineHeight', value)}
        />
      )}
      {isEditable('letterSpacing') && (
        <TokenSelect
          label={fieldLabelKey('letterSpacing')}
          tokens={LetterSpacingTokens}
          value={getValue<LetterSpacingToken>('letterSpacing')}
          optionKey={letterSpacingOptionKey}
          defaultToken="normal"
          onChange={(value) => setValue('letterSpacing', value)}
        />
      )}
      {isEditable('color') && (
        <TokenSelect
          label={fieldLabelKey('colour')}
          tokens={TextColorTokens}
          value={getValue<TextColorToken>('color')}
          optionKey={textColourOptionKey}
          defaultToken="regular"
          onChange={(value) => setValue('color', value)}
        />
      )}
      {isEditable('textAlign') && (
        <OptionToggleField
          label={fieldLabelKey('textAlign')}
          options={TextAlignOptions}
          value={getValue<TextAlign>('textAlign')}
          onChange={(value) => setValue('textAlign', value)}
        />
      )}
      {isEditable('textTransform') && (
        <OptionToggleField
          label={fieldLabelKey('textTransform')}
          options={TextTransformOptions}
          value={getValue<TextTransform>('textTransform') ?? 'none'}
          onChange={(value) =>
            setValue('textTransform', value === 'none' ? undefined : value)
          }
        />
      )}
      {showTruncate && isEditable('truncate') && (
        <TruncateField
          value={getValue<number>('truncate')}
          onChange={(value) => setValue('truncate', value)}
        />
      )}
    </>
  );
};
