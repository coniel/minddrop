import { DefaultEditorElementStyle } from '../styles';
import { EditorElement } from '../types';

export type EditorElementTemplate = Omit<EditorElement, 'id'>;

export const EditorElementTemplate: EditorElementTemplate = {
  type: 'editor',
  style: { ...DefaultEditorElementStyle },
};
