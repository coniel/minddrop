import { DesignWebviewElement } from '../../DesignElements';
import { FlatWebviewElement } from '../../types';

export interface DesignStudioWebviewElementProps {
  element: FlatWebviewElement;
}

/**
 * Renders a webview element in the design studio.
 */
export const DesignStudioWebviewElement: React.FC<
  DesignStudioWebviewElementProps
> = ({ element }) => {
  return <DesignWebviewElement element={element} />;
};
