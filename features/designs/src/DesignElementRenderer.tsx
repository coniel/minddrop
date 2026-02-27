import { DesignElement } from '@minddrop/designs';
import { LeafElementRenderer } from './LeafElement';
import { isLeafElement } from './utils';

export interface DesignElementRendererProps {
  element: DesignElement;
}

export const DesignElementRenderer: React.FC<DesignElementRendererProps> = ({
  element,
}) => {
  if (isLeafElement(element)) {
    return <LeafElementRenderer element={element} />;
  }

  return null;
};
