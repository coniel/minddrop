import { DesignElementConfig, Designs } from '@minddrop/designs-next';
import { EditorElement } from './EditorElement.types';
import { EditorElementRenderer } from './EditorElementRenderer';

export const EditorElementType = 'editor';

// The height a new editor element takes, in grid units
const DefaultRowSpan = 60;

/**
 * Config for the editor element: a content property's document,
 * rendered in a rich content editor.
 */
export const EditorElementConfig: DesignElementConfig<EditorElement> = {
  type: EditorElementType,
  label: 'designsNext.elements.editor.label',
  icon: 'text-quote',
  group: 'content',
  propertyTypes: ['content'],
  component: EditorElementRenderer,
  defaultColumnSpan: Designs.constants.DefaultColumns,
  defaultRowSpan: DefaultRowSpan,
  defaultContentFit: 'grow',
  settingGroups: ['text'],
};
