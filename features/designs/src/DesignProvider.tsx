import { useMemo } from 'react';
import {
  ElementSchema,
  ElementTree,
  LeafElementSchema,
} from '@minddrop/designs';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { createContext } from '@minddrop/utils';

interface DesignProviderData {
  elements: Record<string, ElementSchema>;
  properties: PropertiesSchema;
  propertyValues: PropertyMap;
}

export interface DesignProviderProps {
  children: React.ReactNode;
  elementTree: ElementTree;
  properties: PropertiesSchema;
  propertyValues: PropertyMap;
}

const [hook, Provider, Consumer] = createContext<DesignProviderData>();

export const useDesign = hook;
export const DesignProviderConsumer = Consumer;

export const DesignProvider: React.FC<DesignProviderProps> = ({
  children,
  elementTree,
  properties,
  propertyValues,
}) => {
  const elements = useMemo(() => parseElementTree(elementTree), [elementTree]);

  return (
    <Provider
      value={{
        elements,
        properties,
        propertyValues,
      }}
    >
      {children}
    </Provider>
  );
};

function parseElementTree(
  elementTree: ElementTree,
): Record<string, ElementSchema> {
  const elements: Record<string, ElementSchema> = {};

  function addElement(element: LeafElementSchema | ElementTree) {
    if ('children' in element) {
      elements[element.id] = {
        ...element,
        children: element.children.map((child) => child.id),
      };
      element.children.forEach((child) => addElement(child));
    } else {
      elements[element.id] = element;
    }
  }

  addElement(elementTree);

  return elements;
}
