import {
  AspectRatio,
  BorderLineStyle,
  FillRatio,
  FontFamilyToken,
  FontSizeToken,
  FontWeightToken,
  IconSizeToken,
  LetterSpacingToken,
  LineHeightToken,
  MeasureToken,
  ObjectFit,
  RadiusToken,
  SizeToken,
  SpaceToken,
} from '@minddrop/designs';
import { TranslationKey, createI18nKeyBuilder } from '@minddrop/i18n';

/**
 * The part of an option's copy being addressed: its short label,
 * or the helper text explaining what the step is for.
 */
export type OptionKeyPart = 'label' | 'description';

/**
 * Builds the i18n key of a style field's label.
 */
export const fieldLabelKey = createI18nKeyBuilder(
  'designsStudio.style.fields.',
);

/**
 * Builds the i18n key of a style section's label.
 */
export const sectionLabelKey = createI18nKeyBuilder(
  'designsStudio.style.sections.',
);

const fontFamilyKey = createI18nKeyBuilder('designsStudio.style.fontFamily.');
const fontSizeKey = createI18nKeyBuilder('designsStudio.style.fontSize.');
const fontWeightKey = createI18nKeyBuilder('designsStudio.style.fontWeight.');
const lineHeightKey = createI18nKeyBuilder('designsStudio.style.lineHeight.');
const letterSpacingKey = createI18nKeyBuilder(
  'designsStudio.style.letterSpacing.',
);
const measureKey = createI18nKeyBuilder('designsStudio.style.measure.');
const spaceKey = createI18nKeyBuilder('designsStudio.style.space.');
const sizeKey = createI18nKeyBuilder('designsStudio.style.size.');
const radiusKey = createI18nKeyBuilder('designsStudio.style.radius.');
const borderStyleKey = createI18nKeyBuilder('designsStudio.style.borderStyle.');
const iconSizeKey = createI18nKeyBuilder('designsStudio.style.iconSize.');
const aspectRatioKey = createI18nKeyBuilder('designsStudio.style.aspectRatio.');
const objectFitKey = createI18nKeyBuilder('designsStudio.style.objectFit.');
const fillRatioOptionKey = createI18nKeyBuilder(
  'designsStudio.style.fillRatio.',
);

/**
 * Resolves the label or helper text key of a font family option.
 */
export function fontFamilyOptionKey(
  token: FontFamilyToken,
  part: OptionKeyPart,
): TranslationKey {
  return fontFamilyKey(token, part);
}

/**
 * Resolves the label or helper text key of a font size option.
 */
export function fontSizeOptionKey(
  token: FontSizeToken,
  part: OptionKeyPart,
): TranslationKey {
  return fontSizeKey(token, part);
}

/**
 * Resolves the label or helper text key of a font weight option.
 */
export function fontWeightOptionKey(
  token: FontWeightToken,
  part: OptionKeyPart,
): TranslationKey {
  return fontWeightKey(token, part);
}

/**
 * Resolves the label or helper text key of a line height option.
 */
export function lineHeightOptionKey(
  token: LineHeightToken,
  part: OptionKeyPart,
): TranslationKey {
  return lineHeightKey(token, part);
}

/**
 * Resolves the label or helper text key of a letter spacing option.
 */
export function letterSpacingOptionKey(
  token: LetterSpacingToken,
  part: OptionKeyPart,
): TranslationKey {
  return letterSpacingKey(token, part);
}

/**
 * Resolves the label or helper text key of a measure option.
 */
export function measureOptionKey(
  token: MeasureToken,
  part: OptionKeyPart,
): TranslationKey {
  return measureKey(token, part);
}

/**
 * Resolves the label key of a spacing option. Spacing options are
 * labelled by their measurement, which leaves nothing for helper
 * text to add.
 */
export function spaceOptionKey(
  token: SpaceToken,
  part: 'label',
): TranslationKey;
export function spaceOptionKey(
  token: SpaceToken,
  part: 'description',
): undefined;
export function spaceOptionKey(
  token: SpaceToken,
  part: OptionKeyPart,
): TranslationKey | undefined {
  if (part === 'description') {
    return undefined;
  }

  return spaceKey(token, part);
}

/**
 * Resolves the label key of a fill ratio option.
 */
export function fillRatioKey(ratio: FillRatio, part: 'label'): TranslationKey {
  return fillRatioOptionKey(`${ratio}`, part);
}

/**
 * Resolves the key of the measurement a spacing option resolves
 * to at the default density.
 */
export function spaceHintKey(token: SpaceToken): TranslationKey {
  return spaceKey(token, 'hint');
}

/**
 * Resolves the label key of a box size option. Sizes are labelled
 * by their measurement, which leaves nothing for helper text to
 * add.
 */
export function sizeOptionKey(token: SizeToken, part: 'label'): TranslationKey;
export function sizeOptionKey(token: SizeToken, part: 'description'): undefined;
export function sizeOptionKey(
  token: SizeToken,
  part: OptionKeyPart,
): TranslationKey | undefined {
  if (part === 'description') {
    return undefined;
  }

  return sizeKey(token, part);
}

/**
 * Resolves the key of the measurement a box size option resolves
 * to.
 */
export function sizeHintKey(token: SizeToken): TranslationKey {
  return sizeKey(token, 'hint');
}

/**
 * Resolves the label or helper text key of a corner radius option.
 */
export function radiusOptionKey(
  token: RadiusToken,
  part: OptionKeyPart,
): TranslationKey {
  return radiusKey(token, part);
}

/**
 * Resolves the label or helper text key of a border line option.
 */
export function borderStyleOptionKey(
  token: BorderLineStyle,
  part: OptionKeyPart,
): TranslationKey {
  return borderStyleKey(token, part);
}

/**
 * Resolves the label or helper text key of an icon size option.
 */
export function iconSizeOptionKey(
  token: IconSizeToken,
  part: OptionKeyPart,
): TranslationKey {
  return iconSizeKey(token, part);
}

/**
 * Resolves the label key of an aspect ratio option, which is the
 * ratio itself and so takes no helper text.
 */
export function aspectRatioOptionKey(
  token: AspectRatio,
  part: 'label',
): TranslationKey;
export function aspectRatioOptionKey(
  token: AspectRatio,
  part: 'description',
): undefined;
export function aspectRatioOptionKey(
  token: AspectRatio,
  part: OptionKeyPart,
): TranslationKey | undefined {
  if (part === 'description') {
    return undefined;
  }

  return aspectRatioKey(token, part);
}

/**
 * Resolves the label or helper text key of an image fit option.
 */
export function objectFitOptionKey(
  token: ObjectFit,
  part: OptionKeyPart,
): TranslationKey {
  return objectFitKey(token, part);
}
