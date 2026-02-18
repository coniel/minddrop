import { PropertyDesignElement } from '@minddrop/designs';
import { useProperty } from '../DesignPropertiesProvider';
import { DesignText } from '../DesignText';
import { createStyleObject } from '../utils';
import { DesignTextPropertyElement } from './TextPropertyElement';

export interface PropertyDesignElementRendererProps {
  /**
   * The property based element to render.
   */
  element: PropertyDesignElement;
}

export const PropertyDesignElementRenderer: React.FC<
  PropertyDesignElementRendererProps
> = ({ element }) => {
  const property = useProperty(element.property);

  if (!property) {
    return null;
  }

  const { schema, value } = property;

  if (schema.type === 'text' && element.type === 'text-property') {
    return (
      <DesignTextPropertyElement
        element={element}
        propertySchema={schema}
        propertyValue={typeof value !== 'undefined' ? `${value}` : undefined}
      />
    );
  } else if (schema.type === 'title' && element.type === 'title-property') {
    return (
      <DesignText text={`${value}`} style={createStyleObject(element.style)} />
    );
  }
};
