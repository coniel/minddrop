import { Design, RootElementSchema } from '@minddrop/designs';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { DesignProvider, DesignProviderConsumer } from './DesignProvider';
import { RootElement } from './RootElement';

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
  return (
    <DesignProvider
      elementTree={design.elements}
      properties={properties}
      propertyValues={propertyValues}
    >
      <DesignProviderConsumer>
        {({ elements }) =>
          elements['root'] ? (
            <RootElement
              element={elements['root'] as unknown as RootElementSchema}
            />
          ) : null
        }
      </DesignProviderConsumer>
    </DesignProvider>
  );
};
