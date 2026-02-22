import { Design } from '@minddrop/designs';
import { DesignElementRenderer } from './DesignElementRenderer';
import {
  DesignPropertiesProvider,
  DesignPropertiesProviderProps,
} from './DesignPropertiesProvider';
import { createContainerStyleObject } from './utils';

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
  const style = createContainerStyleObject(design.tree.style);

  return (
    <DesignPropertiesProvider
      properties={properties}
      propertyValues={propertyValues}
      onUpdatePropertyValue={onUpdatePropertyValue}
    >
      <div className="card-element" style={style}>
        {design.tree.children.map((child) => (
          <DesignElementRenderer key={child.id} element={child} />
        ))}
      </div>
    </DesignPropertiesProvider>
  );
};
