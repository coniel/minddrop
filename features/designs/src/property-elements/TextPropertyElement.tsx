import { TextPropertyElement } from '@minddrop/designs';
import { TextPropertySchema } from '@minddrop/properties';
import { DesignText } from '../DesignText';
import { createStyleObject } from '../utils';

export interface DesignTextPropertyElementProps {
  /**
   * The text property element to render.
   */
  element: TextPropertyElement;

  /**
   * The schema of the text property.
   */
  propertySchema: TextPropertySchema;

  /**
   * The value of the text property.
   */
  propertyValue?: string;
}

export const DesignTextPropertyElement: React.FC<
  DesignTextPropertyElementProps
> = ({ element, propertySchema, propertyValue }) => {
  return (
    <div className="design-text-property-element">
      <DesignText
        text={propertyValue || propertySchema.defaultValue}
        style={createStyleObject(element.style)}
      />
    </div>
  );
};
