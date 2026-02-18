import { DesignElement } from '@minddrop/designs';
import { DesignText } from './DesignText';
import { PropertyDesignElementRenderer } from './property-elements/PropertyElementRenderer';
import { createStyleObject, isPropertyElement } from './utils';

export interface DesignElementRendererProps {
  element: DesignElement;
}

export const DesignElementRenderer: React.FC<DesignElementRendererProps> = ({
  element,
}) => {
  if (isPropertyElement(element)) {
    return <PropertyDesignElementRenderer element={element} />;
  }

  switch (element.type) {
    case 'text':
      return (
        <DesignText
          text={element.value}
          style={createStyleObject(element.style)}
        />
      );
    default:
      return null;
  }
};
