import { BadgeStyle } from './BadgeStyle';
import { ContainerStyle } from './ContainerStyle';
import { EditorStyle } from './EditorStyle';
import { EmbedStyle } from './EmbedStyle';
import { IconStyle } from './IconStyle';
import { ImageStyle } from './ImageStyle';
import { RootStyle } from './RootStyle';
import { TypographyStyle } from './TypographyStyle';

/**
 * Union of every element style shape.
 */
export type DesignElementStyle =
  | TypographyStyle
  | BadgeStyle
  | ContainerStyle
  | RootStyle
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
