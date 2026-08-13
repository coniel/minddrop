import type { CSSProperties } from 'react';
import { EditorStyle } from '../styles';
import { tokenCssVariable } from '../tokens';
import { createTypographyCss } from './createTypographyCss';
import { borderCss, marginCss, paddingCss, widthCss } from './cssBlocks';

/**
 * Emits CSS for a rich content editor style. The editor's title bar
 * is emitted separately by `createEditorTitleCss`.
 */
export function createEditorCss(style: EditorStyle): CSSProperties {
  const css: CSSProperties = {
    ...paddingCss(style),
    ...marginCss(style),
    ...borderCss(style),
    ...widthCss(style),
  };

  // Emit the editor content typography
  if (style.fontFamily) {
    css.fontFamily = tokenCssVariable('fontFamily', style.fontFamily);
  }

  if (style.color) {
    css.color = tokenCssVariable('textColor', style.color);
  }

  return css;
}

/**
 * Emits the CSS a renderer applies to the editor's title bar.
 */
export function createEditorTitleCss(style: EditorStyle): CSSProperties {
  return createTypographyCss(style.title ?? {});
}
