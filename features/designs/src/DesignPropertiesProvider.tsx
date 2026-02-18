import {
  PropertiesSchema,
  PropertyMap,
  PropertySchema,
  PropertyValue,
} from '@minddrop/properties';
import { createContext } from '@minddrop/utils';

interface DesignPropertiesProviderData {
  properties: PropertiesSchema;
  propertyValues: PropertyMap;
}

export interface DesignPropertiesProviderProps
  extends DesignPropertiesProviderData {
  children: React.ReactNode;
}

const [hook, Provider] = createContext<DesignPropertiesProviderData>();

export const useDesignProperties = hook;
export const DesignPropertiesProvider = ({
  properties,
  propertyValues,
  children,
}: DesignPropertiesProviderProps) => {
  return <Provider value={{ properties, propertyValues }}>{children}</Provider>;
};

export const useProperty = (
  name: string,
): { schema: PropertySchema; value?: PropertyValue } | null => {
  const value = useDesignProperties().propertyValues[name];
  const schema = useDesignProperties().properties.find(
    (property) => property.name === name,
  );

  if (!schema) {
    return null;
  }

  return {
    schema,
    value,
  };
};
