import { ContainerElement } from '@minddrop/designs';
import { ContainerSurface } from './ContainerSurface';

export interface ContainerDesignElementProps {
  /**
   * The container element to render.
   */
  element: ContainerElement;
}

/**
 * Display renderer for the container element.
 */
export const ContainerDesignElement: React.FC<ContainerDesignElementProps> = ({
  element,
}) => {
  return <ContainerSurface element={element} />;
};
