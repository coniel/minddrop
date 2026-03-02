import { DesignWebviewElement } from '@minddrop/feature-designs';
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
