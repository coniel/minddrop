import { useCallback, useEffect, useMemo, useState } from 'react';
import { Database, Databases } from '@minddrop/databases';
import {
  Design,
  DesignElementScehmaTemplates,
  ElementSchema,
  ElementTree,
  LeafElementSchema,
  PropertyElementSchema,
} from '@minddrop/designs';
import { CloseAppSidebar, Events, OpenAppSidebar } from '@minddrop/events';
import { useDraggable } from '@minddrop/selection';
import { MenuLabel } from '@minddrop/ui-primitives';
import { uuid } from '@minddrop/utils';
import { DesignStudioCard } from '../DesignStudioCard';
import { DesignStudioProvider } from '../DesignStudioProvider';
import './DesignStudio.css';

export interface DesignStudioProps {
  /**
   * The ID of the database for which to display the design studio.
   */
  databaseId: string;

  /**
   * The ID of the design to edit.
   */
  designId: string;
}

export const DesignStudio: React.FC<DesignStudioProps> = ({
  databaseId,
  designId,
}) => {
  const originalDesign = useMemo(() => {
    const database = Databases.get(databaseId);
    const design = database?.designs.find((d) => d.id === designId);

    return design;
  }, [databaseId, designId]);

  const [unusedPropertyElements, setUnusedPropertyElements] = useState<
    PropertyElementSchema[]
  >(getUnusedProperties(databaseId, designId));

  const updateDesign = useCallback(
    (rootElement: ElementTree) => {
      const database = Databases.get(databaseId);
      const design = database.designs.find((d) => d.id === designId);

      if (!design) {
        return;
      }

      const usedProperties = getUsedProperties(rootElement);
      const unusedProperties = database.properties.filter(
        (property) => !usedProperties.includes(property.name),
      );

      setUnusedPropertyElements(propertiesToElements(unusedProperties));

      Databases.updateDesign(database.id, { ...design, elements: rootElement });
    },
    [databaseId, designId],
  );

  if (!originalDesign) {
    return null;
  }

  console.log('RENDERING');

  return (
    <DesignStudioProvider
      elementTree={originalDesign.elements}
      onChange={updateDesign}
    >
      <div className="design-studio">
        <div className="design">
          <DesignStudioCard />
        </div>
        <div className="panel elements-picker">
          <MenuLabel>Properties</MenuLabel>
          {unusedPropertyElements.map((propertyElement) => (
            <PropertyElement key={propertyElement.id} element={propertyElement}>
              <div>{propertyElement.property}</div>
            </PropertyElement>
          ))}
        </div>
      </div>
    </DesignStudioProvider>
  );
};

const PropertyElement: React.FC<{
  children: React.ReactNode;
  element: PropertyElementSchema;
}> = (props) => {
  const { onDragStart, onDragEnd } = useDraggable({
    id: props.element.id,
    type: 'unused-database-properties',
    data: props.element,
  });

  return (
    <div
      className="draggable"
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {props.children}
    </div>
  );
};

function propertiesToElements(
  properties: Database['properties'],
): PropertyElementSchema[] {
  return properties.map((property) => ({
    type: property.type || 'text',
    style: {},
    ...(DesignElementScehmaTemplates[property.type] ?? {}),
    property: property.name,
    id: uuid(),
  }));
}

function getUnusedProperties(
  databaseId: string,
  designId: string,
): PropertyElementSchema[] {
  const database = Databases.get(databaseId);
  const design = database?.designs.find((d) => d.id === designId);

  if (!database || !design) {
    return [] as PropertyElementSchema[];
  }

  const usedProperties = getUsedProperties(design.elements);
  const unusedProperties = database.properties.filter(
    (property) => !usedProperties.includes(property.name),
  );

  return propertiesToElements(unusedProperties);
}

function getUsedProperties(rootElement: ElementTree): string[] {
  const usedProperties: string[] = [];

  function addUsedProperties(element: ElementTree | LeafElementSchema) {
    if ('property' in element) {
      usedProperties.push(element.property);
    }

    if ('children' in element) {
      element.children.forEach((child) => addUsedProperties(child));
    }
  }

  addUsedProperties(rootElement);

  return usedProperties;
}
