import type { CSSProperties } from 'react';
import { PropertyLabelStyle } from '../styles';
import { textColorCss } from './cssBlocks';

/**
 * Emits the CSS a renderer applies to a property element's name
 * label. The selected variant's look is fixed renderer styling,
 * so only the colour is emitted, subtle unless recoloured.
 */
export function createPropertyLabelCss(
  style: PropertyLabelStyle = {},
): CSSProperties {
  return textColorCss({ color: style.color ?? 'subtle' });
}
