import { useMemo, useState } from 'react';
import { Design, DesignElement } from '@minddrop/designs';
import { createContext } from '@minddrop/utils';

export interface DesignStudioProviderProps {
  children: React.ReactNode;

  /**
   * The design to edit.
   */
  design: Design;
}

export interface DesignStudioProvider {
  /**
   * The design elements tree.
   */
  tree: Design['tree'];

  /**
   * An [id]: DesignElement map of the elements which are part of the current design.
   */
  elements: Record<string, DesignElement>;
}

type Index = Record<string, DesignElement>;

const [hook, Provider] = createContext<DesignStudioProvider>();

export const useDesignStudio = hook;

export const DesignStudioProvider: React.FC<DesignStudioProviderProps> = ({
  children,
  design,
}) => {
  const [tree, setTree] = useState(design.tree);
  // Maintain flat index for O(1) lookups
  const index = useMemo(() => buildIndex(tree), [tree]);

  return <Provider value={{ elements: index, tree }}>{children}</Provider>;
};

// Helper to build index
function buildIndex(element: DesignElement, index: Index = {}) {
  index[element.id] = element;

  if ('children' in element) {
    element.children.forEach((child) => buildIndex(child, index));
  }

  return index;
}

export const useDesignElement = (id: string): DesignElement => {
  const { elements } = useDesignStudio();

  return elements[id];
};
