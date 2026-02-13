import { useEffect, useRef, useState } from 'react';
import {
  ContainerElementSchema,
  ElementSchema,
  ElementTree,
  LeafElementSchema,
} from '@minddrop/designs';
import { DropEventData } from '@minddrop/selection';
import { createContext } from '@minddrop/utils';

export interface DesignStudioDropEventData {
  'unused-database-properties'?: ElementSchema[];
  'design-element'?: ElementSchema[];
}

interface DesignStudioProviderData {
  elements: Record<string, ElementSchema>;
  childParentMap: Record<string, string>;
  removeElement: (id: string) => void;
  updateElement: (id: string, element: ElementSchema) => void;
  onDrop: (data: DropEventData<DesignStudioDropEventData>) => void;
}

const [hook, Provider] = createContext<DesignStudioProviderData>();

export const useDesignStudio = hook;

export const DesignStudioProvider: React.FC<{
  children: React.ReactNode;
  elementTree: ElementTree;
  onChange: (rootElement: ElementTree) => void;
}> = ({ children, onChange, elementTree }) => {
  const [elements, setElements] = useState<Record<string, ElementSchema>>(
    parseElementTree(elementTree),
  );
  const [elementsVersion, setElementsVersion] = useState(0);
  const [childParentMap, setChildParentMap] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (elementsVersion === 0) {
      return;
    }

    onChange(buildElementTree(elements));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementsVersion, onChange]);

  function addElement(element: ElementSchema) {
    setElements((prevElements) => ({
      ...prevElements,
      [element.id]: element,
    }));
    setElementsVersion((prevVersion) => prevVersion + 1);
  }

  function removeElement(id: string) {
    setElements((prevElements) => {
      const { [id]: _, ...rest } = prevElements;

      return rest;
    });
    setElementsVersion((prevVersion) => prevVersion + 1);
  }

  function updateElement(id: string, element: ElementSchema) {
    setElements((prevElements) => ({
      ...prevElements,
      [id]: element,
    }));
    setElementsVersion((prevVersion) => prevVersion + 1);
  }

  function addChildToParent(id: string, parentId: string, index: number) {
    if (!elements[parentId] || !('children' in elements[parentId])) {
      return;
    }

    setChildParentMap((prevChildParentMap) => ({
      ...prevChildParentMap,
      [id]: parentId,
    }));

    setElements((prevElements) => {
      const { [parentId]: parent, ...rest } = prevElements;

      return {
        ...rest,
        [parentId]: {
          ...parent,
          children: [
            ...(parent as ContainerElementSchema).children.slice(0, index),
            id,
            ...(parent as ContainerElementSchema).children.slice(index),
          ],
        },
      };
    });
    setElementsVersion((prevVersion) => prevVersion + 1);
  }

  function removeChildFromParent(id: string, parentId: string) {
    if (!elements[parentId] || 'children' in elements[parentId]) {
      return;
    }

    setElements((prevElements) => {
      const { [parentId]: parent, ...rest } = prevElements;

      return {
        ...rest,
        [parentId]: {
          ...parent,
          children: (parent as ContainerElementSchema).children.filter(
            (childId) => childId !== id,
          ),
        },
      };
    });
    setElementsVersion((prevVersion) => prevVersion + 1);

    setChildParentMap((prevChildParentMap) => {
      const { [id]: _, ...rest } = prevChildParentMap;

      return rest;
    });
  }

  function reorderChild(id: string, parentId: string, index: number) {
    if (!elements[parentId] || !('children' in elements[parentId])) {
      return;
    }

    // Do nothing if the child is already at the correct index
    if (elements[parentId].children[index] === id) {
      return;
    }

    const reorderedChildren = reorderStringToIndex(
      elements[parentId].children,
      id,
      index,
    );

    setElements((prevElements) => {
      const { [parentId]: parent, ...rest } = prevElements;

      return {
        ...rest,
        [parentId]: {
          ...parent,
          children: reorderedChildren,
        },
      };
    });
    setElementsVersion((prevVersion) => prevVersion + 1);
  }

  function handleDrop(dropEvent: DropEventData<DesignStudioDropEventData>) {
    const { targetType, targetId, data } = dropEvent;
    let parentId: string | undefined;
    let index = dropEvent.index ?? 0;

    if (!targetType || !targetId) {
      return;
    }

    if (targetType === 'design-element') {
      parentId = childParentMap[targetId];

      if (dropEvent.position === 'before') {
        index = index - 1;
      }
    }

    if (targetType === 'flex-drop-container') {
      parentId = targetId;
    }

    if (!parentId) {
      return;
    }

    if (data['unused-database-properties']?.length) {
      const element = data['unused-database-properties'][0];
      addElement(element);
      addChildToParent(element.id, parentId, index);
    }

    if (data['design-element']?.length) {
      const element = data['design-element'][0];

      if (targetId === element.id) {
        return;
      }

      if (parentId !== childParentMap[element.id]) {
        removeChildFromParent(element.id, parentId);
        addChildToParent(element.id, parentId, index);
      } else {
        reorderChild(element.id, parentId, index);
      }
    }
  }

  return (
    <Provider
      value={{
        elements,
        childParentMap,
        removeElement,
        updateElement,
        onDrop: handleDrop,
      }}
    >
      {children}
    </Provider>
  );
};

function reorderStringToIndex(
  items: string[],
  value: string,
  targetIndex: number,
): string[] {
  const currentIndex = items.indexOf(value);

  if (currentIndex === -1) {
    return items.slice();
  }

  const result = items.slice();
  const [removed] = result.splice(currentIndex, 1);

  const clampedIndex = Math.max(0, Math.min(targetIndex, result.length));
  result.splice(clampedIndex, 0, removed);

  return result;
}

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

function buildElementTree(
  elements: Record<string, ElementSchema>,
): ElementTree {
  const rootElement = elements['root'] as ContainerElementSchema;

  if (!rootElement) {
    throw new Error('Root element not found');
  }

  return addElementChildren(rootElement, elements) as ElementTree;
}

function addElementChildren(
  element: ElementSchema,
  elements: Record<string, ElementSchema>,
): ElementTree | LeafElementSchema {
  if ('children' in element) {
    return {
      ...element,
      children: element.children.map((childId) =>
        addElementChildren(elements[childId], elements),
      ),
    };
  }

  return element;
}
