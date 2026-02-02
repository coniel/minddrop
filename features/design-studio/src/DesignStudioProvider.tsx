import { useState } from 'react';
import { ContainerElementSchema, ElementSchema } from '@minddrop/designs';
import { DropEventData } from '@minddrop/selection';
import { createContext, uuid } from '@minddrop/utils';

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
}> = ({ children }) => {
  const [elements, setElements] = useState<Record<string, ElementSchema>>({
    root: {
      type: 'container',
      direction: 'column',
      style: {},
      children: [],
      id: uuid(),
    },
  });
  const [childParentMap, setChildParentMap] = useState<Record<string, string>>(
    {},
  );

  function addElement(element: ElementSchema) {
    setElements((prevElements) => ({
      ...prevElements,
      [element.id]: element,
    }));
  }

  function removeElement(id: string) {
    setElements((prevElements) => {
      const { [id]: _, ...rest } = prevElements;

      return rest;
    });
  }

  function updateElement(id: string, element: ElementSchema) {
    setElements((prevElements) => ({
      ...prevElements,
      [id]: element,
    }));
  }

  function addChildToParent(id: string, parentId: string, index: number) {
    if (!elements[parentId] || !('children' in elements[parentId])) {
      console.log('Parent not found', elements, parentId);
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

    setChildParentMap((prevChildParentMap) => {
      const { [id]: _, ...rest } = prevChildParentMap;

      return rest;
    });
  }

  function reorderChild(id: string, parentId: string, index: number) {
    if (!elements[parentId] || !('children' in elements[parentId])) {
      console.log('Parent not found', elements, parentId);
      return;
    }

    // Do nothing if the child is already at the correct index
    if (elements[parentId].children[index] === id) {
      console.log('Child already at correct index');
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
  }

  function handleDrop(dropEvent: DropEventData<DesignStudioDropEventData>) {
    const { targetType, targetId, data } = dropEvent;
    let parentId: string | undefined;
    let index = dropEvent.index ?? 0;

    console.log(dropEvent);

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
      console.log('Adding unused database properties');
      const element = data['unused-database-properties'][0];
      addElement(element);
      addChildToParent(element.id, parentId, index);
    }

    if (data['design-element']?.length) {
      const element = data['design-element'][0];

      if (targetId === element.id) {
        console.log('Dropped on self');
        return;
      }

      if (parentId !== childParentMap[element.id]) {
        console.log('Moving child');
        removeChildFromParent(element.id, parentId);
        addChildToParent(element.id, parentId, index);
      } else {
        console.log('Reordering child');
        reorderChild(element.id, parentId, index);
      }
    }
  }

  console.log(elements);

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
