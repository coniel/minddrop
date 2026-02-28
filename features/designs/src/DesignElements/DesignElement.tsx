import {
  ContainerElement,
  DesignElement as DesignElementType,
} from '@minddrop/designs';
import { DesignContainerElement } from './DesignContainerElement';
import { DesignFormattedTextElement } from './DesignFormattedTextElement';
import { DesignIconElement } from './DesignIconElement';
import { DesignImageElement } from './DesignImageElement';
import { DesignNumberElement } from './DesignNumberElement';
import { DesignTextElement } from './DesignTextElement';

export interface DesignElementProps {
  /**
   * The design element to render.
   */
  element: DesignElementType;
}

/**
 * Dispatcher component that routes a design element to the
 * correct type-specific renderer based on `element.type`.
 */
export const DesignElement: React.FC<DesignElementProps> = ({ element }) => {
  switch (element.type) {
    case 'text':
      return <DesignTextElement element={element} />;
    case 'formatted-text':
      return <DesignFormattedTextElement element={element} />;
    case 'number':
      return <DesignNumberElement element={element} />;
    case 'image':
      return <DesignImageElement element={element} />;
    case 'icon':
      return <DesignIconElement element={element} />;
    case 'container':
      return <DesignContainerElement element={element as ContainerElement} />;
    default:
      return null;
  }
};
