import { DefaultEditorElementStyle, EditorElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface EditorElement extends DesignElementBase {
  type: 'editor';

  /**
   * The element style.
   */
  style: EditorElementStyle;
}

export const EditorElementConfig: DesignElementConfig = {
  type: 'editor',
  icon: 'text-cursor',
  label: 'design-studio.elements.editor',
  group: 'content',
  styleCategory: 'editor',
  compatiblePropertyTypes: ['formatted-text'],
  template: {
    type: 'editor',
    style: { ...DefaultEditorElementStyle },
  },
};
