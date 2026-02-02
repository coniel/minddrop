import { useEffect, useState } from 'react';
import { Database, Databases } from '@minddrop/databases';
import {
  DesignElementScehmaTemplates,
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
}

export const DesignStudio: React.FC<DesignStudioProps> = ({ databaseId }) => {
  const database = Databases.use(databaseId);
  const [unusedPropertyElements, setUnusedPropertyElements] = useState<
    PropertyElementSchema[]
  >(propertiesToElements(database?.properties ?? []));
  useEffect(() => {
    Events.dispatch(CloseAppSidebar);

    return () => {
      Events.dispatch(OpenAppSidebar);
    };
  }, []);

  return (
    <DesignStudioProvider>
      <div className="design-studio">
        <div className="panel elements-picker">
          <MenuLabel>Properties</MenuLabel>
          {unusedPropertyElements.map((propertyElement) => (
            <PropertyElement key={propertyElement.id} element={propertyElement}>
              <div>{propertyElement.property}</div>
            </PropertyElement>
          ))}
        </div>
        <div className="design">
          <DesignStudioCard />
        </div>
        <div className="panel elements-config"></div>
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
