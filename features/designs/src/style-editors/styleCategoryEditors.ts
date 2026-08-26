import { StyleCategory } from '@minddrop/designs';
import { BadgeStyleEditor } from './BadgeStyleEditor';
import { ContainerStyleEditor } from './ContainerStyleEditor';
import { EditorStyleEditor } from './EditorStyleEditor';
import { EmbedStyleEditor } from './EmbedStyleEditor';
import { FieldStyleEditor } from './FieldStyleEditor';
import { IconStyleEditor } from './IconStyleEditor';
import { ImageStyleEditor } from './ImageStyleEditor';
import { StyleEditorProps } from './StyleEditorProps';
import { TypographyStyleEditor } from './TypographyStyleEditor';

/**
 * The style editor rendered for each style category. Elements
 * declare their category in their config, so a new element type
 * reusing an existing style shape needs no editor of its own.
 */
export const styleCategoryEditors: Record<
  StyleCategory,
  React.ComponentType<StyleEditorProps>
> = {
  typography: TypographyStyleEditor,
  badge: BadgeStyleEditor,
  container: ContainerStyleEditor,
  image: ImageStyleEditor,
  icon: IconStyleEditor,
  embed: EmbedStyleEditor,
  editor: EditorStyleEditor,
  field: FieldStyleEditor,
};
