import { Design } from '@minddrop/designs';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { DesignPropertiesProvider } from './DesignPropertiesProvider';
import { DesignCardElement } from './root-elements';

export interface DesignRendererProps {
  /**
   * The design to render.
   */
  design: Design;

  /**
   * The schema of the properties to render.
   */
  properties?: PropertiesSchema;

  /**
   * The values of the properties to render.
   */
  propertyValues?: PropertyMap;
}

export const DesignRenderer: React.FC<DesignRendererProps> = ({
  design,
  properties = [],
  propertyValues = {},
}) => {
  let component: React.ReactElement | null = null;

  switch (design.type) {
    case 'card':
      component = <DesignCardElement element={design.tree} />;
      break;
    default:
      return null;
  }

  return (
    <DesignPropertiesProvider
      properties={properties}
      propertyValues={propertyValues}
    >
      {component}
    </DesignPropertiesProvider>
  );
};
