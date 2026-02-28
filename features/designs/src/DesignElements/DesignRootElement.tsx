import { RootElement, createElementCssStyle } from '@minddrop/designs';
import { DesignElement } from './DesignElement';

export interface DesignRootElementProps {
  /**
   * The root element to render.
   */
  element: RootElement;
}

/**
 * Pure display renderer for the root design element.
 * Renders a div with root styles and recursively
 * renders child elements.
 */
export const DesignRootElement: React.FC<DesignRootElementProps> = ({
  element,
}) => {
  const { style } = element;

  return (
    <div
      style={{
        ...createElementCssStyle(element),
        display: 'flex',
        flexDirection: style.direction,
        gap: `${style.gap}px`,
        alignItems: style.alignItems,
        justifyContent: style.justifyContent,
      }}
    >
      {element.children.map((child) => (
        <DesignElement key={child.id} element={child} />
      ))}
    </div>
  );
};
