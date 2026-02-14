import { useMemo } from 'react';
import { Databases } from '@minddrop/databases';
import { PropertiesSchema, PropertySchema } from '@minddrop/properties';
import { createContext } from '@minddrop/utils';
import { DesignStudioProvider } from './DesignStudioProvider';

export interface DatabaseDesignStudioProviderProps {
  children: React.ReactNode;

  /**
   * The ID of the database to which the design belongs.
   */
  databaseId: string;

  /**
   * The ID of the design to edit.
   */
  designId: string;
}

export interface DatabaseDesignStudioProvider {
  /**
   * The ID of the database to which the design belongs.
   */
  databaseId: string;

  /**
   * The ID of the design to edit.
   */
  designId: string;

  /**
   * The database's properties.
   */
  properties: PropertiesSchema;
}

const [hook, Provider] = createContext<DatabaseDesignStudioProvider>();

export const useDatabaseDesignStudio = hook;

export const DatabaseDesignStudioProvider: React.FC<
  DatabaseDesignStudioProviderProps
> = ({ children, databaseId, designId }) => {
  // Get the database
  const database = useMemo(() => Databases.get(databaseId), [databaseId]);
  // Get the design to edit
  const design = useMemo(
    () => Databases.getDesign(databaseId, designId),
    [databaseId, designId],
  );

  if (!database || !design) {
    return null;
  }

  return (
    <Provider value={{ databaseId, designId, properties: database.properties }}>
      <DesignStudioProvider design={design}>{children}</DesignStudioProvider>
    </Provider>
  );
};

export const useDatabaseProperty = (
  propertyName: string,
): PropertySchema | null => {
  const { properties } = useDatabaseDesignStudio();

  return properties.find((property) => property.name === propertyName) ?? null;
};
