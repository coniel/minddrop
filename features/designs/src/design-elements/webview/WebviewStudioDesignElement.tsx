import { FlatWebviewElement } from '../../types';
import { WebviewDesignElement } from './WebviewDesignElement';

export interface WebviewStudioDesignElementProps {
  /**
   * The webview element to render in the studio.
   */
  element: FlatWebviewElement;
}

/**
 * Renders a webview element in the design studio.
 */
export const WebviewStudioDesignElement: React.FC<
  WebviewStudioDesignElementProps
> = ({ element }) => {
  return <WebviewDesignElement element={element} />;
};
