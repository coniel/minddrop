import { createElementCssStyle, Design } from '@minddrop/designs';
import { DesignElementRenderer } from './DesignElementRenderer';
import {
  DesignPropertiesProvider,
  DesignPropertiesProviderProps,
} from './DesignPropertiesProvider';

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
  return (
    <DesignPropertiesProvider
      properties={properties}
      propertyValues={propertyValues}
      onUpdatePropertyValue={onUpdatePropertyValue}
    >
      <div className="card-element" style={createElementCssStyle(design.tree)}>
        {design.tree.children.map((child) => (
          <DesignElementRenderer key={child.id} element={child} />
        ))}
      </div>
    </DesignPropertiesProvider>
  );
};
