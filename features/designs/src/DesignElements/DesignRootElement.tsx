import { RootElement } from '@minddrop/designs';
import { LayoutTypeProvider } from '../LayoutTypeContext';
import { ContainerSurface } from '../design-elements/container';

export interface DesignRootElementProps {
  /**
   * The root element to render.
   */
  element: RootElement;

  /**
   * Optional CSS class name applied to the outermost div.
   */
  className?: string;
}

/**
 * Display renderer for the root design element. Renders a
 * container surface filling the layout frame and recursively
 * renders child elements.
 */
export const DesignRootElement: React.FC<DesignRootElementProps> = ({
  element,
  className,
}) => {
  // The root carries its layout type, which context-adapting role
  // styles in the tree below resolve against
  return (
    <LayoutTypeProvider value={element.layoutType ?? null}>
      <ContainerSurface
        element={element}
        className={className}
        containerProps={{ 'data-element-id': element.id }}
        fill
      />
    </LayoutTypeProvider>
  );
};
