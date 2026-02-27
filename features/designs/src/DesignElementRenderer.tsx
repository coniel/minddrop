import { createElementCssStyle, DesignElement } from '@minddrop/designs';
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

  if (element.type === 'container') {
    return (
      <div style={createElementCssStyle(element)}>
        {element.children.map((child) => (
          <DesignElementRenderer key={child.id} element={child} />
        ))}
      </div>
    );
  }

  return null;
};
