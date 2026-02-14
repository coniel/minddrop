import { useMemo } from 'react';
import { DesignElement, RootDesignElement } from '@minddrop/designs';
import { PropertiesSchema } from '@minddrop/properties';
import { MenuLabel } from '@minddrop/ui-primitives';
import { AvailablePropertyElement } from '../AvailablePropertyElement';
import { useDatabaseDesignStudio } from '../DatabaseDesignStudioProvider';
import { useDesignStudio } from '../DesignStudioProvider';
import './AvailableDatabaseProperties.css';

export const AvailableDatabaseProperties: React.FC = () => {
  const { tree } = useDesignStudio();
  const { properties } = useDatabaseDesignStudio();

  const unusedProperties = useMemo(
    () => getUnusedProperties(tree, properties),
    [tree, properties],
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
  rootElement: RootDesignElement,
  properties: PropertiesSchema,
): PropertiesSchema {
  const usedProperties: string[] = [];

  function addUsedProperties(element: DesignElement) {
    if ('property' in element) {
      usedProperties.push(element.property);
    }

    if ('children' in element) {
      element.children.forEach((child) => addUsedProperties(child));
    }
  }

  addUsedProperties(rootElement);

  return properties.filter(
    (property) => !usedProperties.includes(property.name),
  );
}
