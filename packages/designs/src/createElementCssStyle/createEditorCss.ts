import type { CSSProperties } from 'react';
import { TitlePropertyElementConfig } from '../property-element-configs/title';
import { EditorStyle, TypographyStyle } from '../styles';
import { tokenCssVariable } from '../tokens';
import { LayoutType } from '../types';
import { resolvePropertyElementStyle } from '../utils/resolvePropertyElementStyle';
import { createTypographyCss } from './createTypographyCss';
import {
  borderCss,
  marginCss,
  maxWidthCss,
  paddingCss,
  radiusCss,
  textColorCss,
} from './cssBlocks';

/**
 * Emits CSS for a rich content editor style. The editor's title bar
 * is emitted separately by `createEditorTitleCss`.
 */
export function createEditorCss(style: EditorStyle): CSSProperties {
  const css: CSSProperties = {
    ...paddingCss(style),
    ...marginCss(style),
    ...borderCss(style),
    ...radiusCss(style),
    ...maxWidthCss(style),
  };

  // Emit the editor content typography
  if (style.fontFamily) {
    css.fontFamily = tokenCssVariable('fontFamily', style.fontFamily);
  }

  if (style.fontSize) {
    css.fontSize = tokenCssVariable('fontSize', style.fontSize);
  }

  if (style.lineHeight) {
    css.lineHeight = tokenCssVariable('lineHeight', style.lineHeight);
  }

  // The text colour treatment, adjusted by its emphasis
  Object.assign(css, textColorCss(style));

  return css;
}

/**
 * Emits the CSS a renderer applies to the editor's title bar: the
 * title element theme styles of the title style's selected
 * variant, resolved against the layout context, with the title's
 * own colour applied over them.
 */
export function createEditorTitleCss(
  style: EditorStyle,
  layoutType?: LayoutType,
): CSSProperties {
  const title = style.title ?? {};

  // The title bar renders at a title element size, so the variant
  // resolves through the title element's theme styles
  const themeStyle = resolvePropertyElementStyle(
    TitlePropertyElementConfig,
    title.variant,
    layoutType,
  ) as TypographyStyle;

  return createTypographyCss({ ...themeStyle, color: title.color });
}
