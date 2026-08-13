import { BadgeStyle } from './BadgeStyle';
import { ContainerStyle } from './ContainerStyle';
import { EditorStyle } from './EditorStyle';
import { EmbedStyle } from './EmbedStyle';
import { IconStyle } from './IconStyle';
import { ImageStyle } from './ImageStyle';
import { TypographyStyle } from './TypographyStyle';

export * from './blocks';
export * from './TypographyStyle';
export * from './BadgeStyle';
export * from './ContainerStyle';
export * from './ImageStyle';
export * from './IconStyle';
export * from './EmbedStyle';
export * from './EditorStyle';

/**
 * Union of every element style shape.
 */
export type DesignElementStyle =
  | TypographyStyle
  | BadgeStyle
  | ContainerStyle
  | ImageStyle
  | IconStyle
  | EmbedStyle
  | EditorStyle;

/**
 * The style category determining which style shape an element type
 * uses and which CSS generator renders it.
 */
export type StyleCategory =
  | 'typography'
  | 'badge'
  | 'container'
  | 'image'
  | 'icon'
  | 'embed'
  | 'editor';
