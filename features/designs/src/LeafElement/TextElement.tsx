import { TextElement } from '@minddrop/designs';
import { TextPropertySchema } from '@minddrop/properties';
import { DesignText } from '../DesignText';
import { createStyleObject } from '../utils';

export interface DesignTextElementProps {
  /**
   * The text property element to render.
   */
  element: TextElement;

  /**
   * The schema of the text property.
   */
  propertySchema: TextPropertySchema;

  /**
   * The value of the text property.
   */
  propertyValue?: string;
}

export const DesignTextElement: React.FC<DesignTextElementProps> = ({
  element,
  propertySchema,
  propertyValue,
}) => {
  return (
    <div className="design-text-element">
      <DesignText
        text={propertyValue || propertySchema.defaultValue}
        style={createStyleObject(element.style)}
      />
    </div>
  );
};
