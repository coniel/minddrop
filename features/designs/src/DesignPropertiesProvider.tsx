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
  onUpdatePropertyValue?: (name: string, value: PropertyValue) => void;
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
  onUpdatePropertyValue,
  children,
}: DesignPropertiesProviderProps) => {
  return (
    <Provider value={{ properties, propertyValues, onUpdatePropertyValue }}>
      {children}
    </Provider>
  );
};

export const useProperty = (
  name: string,
): {
  schema: PropertySchema;
  value?: PropertyValue;
  updateValue: (value: PropertyValue) => void;
} | null => {
  const onUpdatePropertyValue = useDesignProperties().onUpdatePropertyValue;
  const value = useDesignProperties().propertyValues[name];
  const schema = useDesignProperties().properties.find(
    (property) => property.name === name,
  );

  const updateValue = (newValue: PropertyValue) =>
    onUpdatePropertyValue?.(name, newValue);

  if (!schema) {
    return null;
  }

  return {
    schema,
    value,
    updateValue,
  };
};
