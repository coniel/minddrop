import { DesignEditorElement } from '../../DesignElements';
import { FlatEditorElement } from '../../types';

export interface DesignStudioEditorElementProps {
  /**
   * The editor element to render.
   */
  element: FlatEditorElement;
}

/**
 * Renders an editor element in the design studio.
 */
export const DesignStudioEditorElement: React.FC<
  DesignStudioEditorElementProps
> = ({ element }) => {
  return <DesignEditorElement element={element} />;
};
