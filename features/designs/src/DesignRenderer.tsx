import { Design } from '@minddrop/designs';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';

export interface DesignRendererProps {
  /**
   * The design to render.
   */
  design: Design;

  /**
   * The schema of the properties to render.
   */
  properties: PropertiesSchema;

  /**
   * The values of the properties to render.
   */
  propertyValues: PropertyMap;
}

export const DesignRenderer: React.FC<DesignRendererProps> = ({
  design,
  properties,
  propertyValues,
}) => {
  return <div className="design-renderer"></div>;
};
