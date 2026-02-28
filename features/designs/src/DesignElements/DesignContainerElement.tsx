import { ContainerElement, createContainerCssStyle } from '@minddrop/designs';
import { DesignElement } from './DesignElement';

export interface DesignContainerElementProps {
  /**
   * The container element to render.
   */
  element: ContainerElement;
}

/**
 * Pure display renderer for a container design element.
 * Renders a div with container styles and recursively
 * renders child elements.
 */
export const DesignContainerElement: React.FC<DesignContainerElementProps> = ({
  element,
}) => {
  const { style } = element;

  return (
    <div
      style={{
        ...createContainerCssStyle(style),
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
