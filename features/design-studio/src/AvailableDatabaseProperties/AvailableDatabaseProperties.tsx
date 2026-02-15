import { PropertiesSchema } from '@minddrop/properties';
import { MenuLabel } from '@minddrop/ui-primitives';
import { useShallow } from '@minddrop/utils';
import { AvailablePropertyElement } from '../AvailablePropertyElement';
import { useDesignStudioStore } from '../DesignStudioStore';
import { FlatDesignElement } from '../types';
import './AvailableDatabaseProperties.css';

export const AvailableDatabaseProperties: React.FC = () => {
  const unusedProperties = useDesignStudioStore(
    useShallow((state) =>
      getUnusedProperties(state.elements, state.properties),
    ),
  );

  return (
    <div className="available-database-properties">
      <MenuLabel label="labels.properties" />
      {unusedProperties.map((property) => (
        <AvailablePropertyElement key={property.name} property={property} />
      ))}
    </div>
  );
};

// Helper to get database properties that are not yet used in the design
function getUnusedProperties(
  elements: Record<string, FlatDesignElement>,
  properties: PropertiesSchema,
): PropertiesSchema {
  const usedProperties: string[] = [];

  function addUsedProperties(element: FlatDesignElement) {
    if ('property' in element) {
      usedProperties.push(element.property);
    }

    if ('children' in element) {
      element.children.forEach((child) => addUsedProperties(elements[child]));
    }
  }

  addUsedProperties(elements.root);

  return properties.filter(
    (property) => !usedProperties.includes(property.name),
  );
}
