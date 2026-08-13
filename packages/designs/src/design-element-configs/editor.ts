import { EditorStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface EditorElement extends DesignElementBase {
  type: 'editor';

  /**
   * The element style.
   */
  style: EditorStyle;

  /**
   * The design property rendered as the editor's title block.
   * Only 'title' and 'text' type properties are valid targets.
   */
  titleProperty?: string;
}

export const EditorElementConfig: DesignElementConfig<EditorElement> = {
  type: 'editor',
  icon: 'text-cursor',
  label: 'design-studio.elements.editor',
  group: 'content',
  styleCategory: 'editor',
  compatiblePropertyTypes: ['formatted-text'],
  template: {
    type: 'editor',
    style: {},
  },
};
