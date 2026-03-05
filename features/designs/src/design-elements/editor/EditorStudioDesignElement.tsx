import { FlatEditorElement } from '../../types';
import { EditorDesignElement } from './EditorDesignElement';

export interface EditorStudioDesignElementProps {
  /**
   * The editor element to render.
   */
  element: FlatEditorElement;
}

/**
 * Renders an editor element in the design studio.
 */
export const EditorStudioDesignElement: React.FC<
  EditorStudioDesignElementProps
> = ({ element }) => {
  return <EditorDesignElement element={element} />;
};
