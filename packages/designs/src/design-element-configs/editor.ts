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

/**
 * The editor is only inserted through the content role, so the
 * config omits `group` to exclude it from the palette.
 */
export const EditorElementConfig: DesignElementConfig<EditorElement> = {
  type: 'editor',
  icon: 'text-cursor',
  label: 'design-studio.elements.editor',
  styleCategory: 'editor',
  compatiblePropertyTypes: ['formatted-text'],
  supportsStaticContent: false,
  // An empty editor is where writing starts, so it always renders
  emptyBehavior: 'none',
  template: {
    type: 'editor',
    style: {},
  },
};
