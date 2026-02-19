import { Design } from '@minddrop/designs';
import {
  DesignPropertiesProvider,
  DesignPropertiesProviderProps,
} from './DesignPropertiesProvider';
import { DesignCardElement } from './root-elements';

export interface DesignRendererProps
  extends Pick<
    DesignPropertiesProviderProps,
    'onUpdatePropertyValue' | 'properties' | 'propertyValues'
  > {
  /**
   * The design to render.
   */
  design: Design;
}

export const DesignRenderer: React.FC<DesignRendererProps> = ({
  design,
  properties = [],
  propertyValues = {},
  onUpdatePropertyValue,
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
      onUpdatePropertyValue={onUpdatePropertyValue}
    >
      {component}
    </DesignPropertiesProvider>
  );
};
