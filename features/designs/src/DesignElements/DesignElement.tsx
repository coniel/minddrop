import {
  ContainerElement,
  DesignElement as DesignElementType,
  UrlElement,
  WebviewElement,
} from '@minddrop/designs';
import { DesignContainerElement } from './DesignContainerElement';
import { useDesignElementWrapper } from './DesignElementWrapperContext';
import { DesignFormattedTextElement } from './DesignFormattedTextElement';
import { DesignIconElement } from './DesignIconElement';
import { DesignImageElement } from './DesignImageElement';
import { DesignNumberElement } from './DesignNumberElement';
import { DesignTextElement } from './DesignTextElement';
import { DesignUrlElement } from './DesignUrlElement';
import { DesignWebviewElement } from './DesignWebviewElement';

export interface DesignElementProps {
  /**
   * The design element to render.
   */
  element: DesignElementType;
}

/**
 * Dispatcher component that routes a design element to the
 * correct type-specific renderer based on `element.type`.
 * If a DesignElementWrapperProvider is present, wraps the
 * rendered element with the provided wrapper function.
 */
export const DesignElement: React.FC<DesignElementProps> = ({ element }) => {
  const wrapperConfig = useDesignElementWrapper();

  let rendered: React.ReactNode;

  switch (element.type) {
    case 'text':
      rendered = <DesignTextElement element={element} />;
      break;
    case 'formatted-text':
      rendered = <DesignFormattedTextElement element={element} />;
      break;
    case 'number':
      rendered = <DesignNumberElement element={element} />;
      break;
    case 'url':
      rendered = <DesignUrlElement element={element as UrlElement} />;
      break;
    case 'image':
      rendered = <DesignImageElement element={element} />;
      break;
    case 'icon':
      rendered = <DesignIconElement element={element} />;
      break;
    case 'webview':
      rendered = <DesignWebviewElement element={element as WebviewElement} />;
      break;
    case 'container':
      rendered = (
        <DesignContainerElement element={element as ContainerElement} />
      );
      break;
    default:
      return null;
  }

  // Apply the wrapper if provided and the element type is not excluded
  if (wrapperConfig && !wrapperConfig.excludeTypes.includes(element.type)) {
    rendered = wrapperConfig.wrapper(element, rendered);
  }

  // Wrap in a data-element-id div for DOM querying (e.g. connection lines).
  // Uses display:contents so it doesn't affect layout.
  return (
    <div data-element-id={element.id} style={{ display: 'contents' }}>
      {rendered}
    </div>
  );
};
