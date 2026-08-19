import React, { createContext, useContext } from 'react';
import { Layout, LayoutType } from '@minddrop/designs';
import { PropertySchema } from '@minddrop/properties';
import { useShallow, useStore } from '@minddrop/stores';
import { useLayoutId } from '../LayoutIdContext';
import {
  FlatChildDesignElement,
  FlatDesignElement,
  FlatParentDesignElement,
} from '../types';
import {
  DesignElementStyleKey,
  DesignElementStyleValue,
  DesignStudioState,
  DesignStudioStore,
  getActiveLayout,
  getScopedElements,
} from './DesignStudioStore';

const DesignStudioContext = createContext<DesignStudioStore | null>(null);

export interface DesignStudioProviderProps {
  /**
   * The studio store instance scoping this editor.
   */
  store: DesignStudioStore;

  children: React.ReactNode;
}

/**
 * Provides a design studio store instance to a studio editor tree.
 */
export const DesignStudioProvider: React.FC<DesignStudioProviderProps> = ({
  store,
  children,
}) => {
  return (
    <DesignStudioContext.Provider value={store}>
      {children}
    </DesignStudioContext.Provider>
  );
};

/**
 * Returns the surrounding editor's design studio store instance.
 *
 * @throws If used outside of a DesignStudioProvider.
 */
export function useDesignStudio(): DesignStudioStore {
  const store = useContext(DesignStudioContext);

  // Studio hooks are only meaningful inside an editor tree
  if (!store) {
    throw new Error(
      'useDesignStudio must be used within a DesignStudioProvider.',
    );
  }

  return store;
}

/**
 * Subscribes to the surrounding editor's design studio store.
 *
 * @param selector - Selects the value to subscribe to.
 * @returns The selected value.
 */
export function useDesignStudioStore<T>(
  selector: (state: DesignStudioState) => T,
): T {
  const studio = useDesignStudio();

  return useStore(studio.store, selector);
}

/**
 * Returns the type of the active layout, or null when no layout
 * is active.
 */
export function useActiveLayoutType(): LayoutType | null {
  return useDesignStudioStore((state) => getActiveLayout(state)?.type ?? null);
}

/**
 * Returns the layout being edited, or null when no layout is
 * active.
 */
export function useActiveLayout(): Layout | null {
  return useDesignStudioStore(getActiveLayout);
}

/**
 * Subscribes to an element in the surrounding layout, falling back
 * to the active layout outside of a layout frame.
 *
 * @param id - The ID of the element to subscribe to.
 * @returns The element.
 */
export function useElement<
  TType extends
    | FlatDesignElement
    | FlatChildDesignElement
    | FlatParentDesignElement = FlatDesignElement,
>(id: string): TType {
  const layoutId = useLayoutId();
  const element = useDesignStudioStore(
    (state) => getScopedElements(state, layoutId)[id],
  );

  return element as TType;
}

/**
 * Subscribes to element-specific data with a single selector.
 * Consolidates multiple store reads into one call and avoids
 * per-call type casts at the call site. Annotate the callback
 * parameter with the concrete element type so both generics
 * are inferred automatically.
 */
export function useElementData<
  TElement,
  TResult extends Record<string, unknown>,
>(id: string, selector: (element: TElement) => TResult): TResult {
  const layoutId = useLayoutId();

  return useDesignStudioStore(
    useShallow((state) =>
      selector(getScopedElements(state, layoutId)[id] as TElement),
    ),
  );
}

/**
 * Subscribes to a single style key of an element.
 *
 * @param id - The ID of the element.
 * @param key - The style key to subscribe to.
 * @returns The style value.
 */
export function useElementStyle<K extends DesignElementStyleKey>(
  id: string,
  key: K,
): DesignElementStyleValue<K> | undefined {
  const element = useElement(id);

  return (element.style as Record<string, unknown>)[key] as
    | DesignElementStyleValue<K>
    | undefined;
}

/**
 * Subscribes to a design property of the editor's parent, matched
 * by name.
 *
 * @param name - The property name.
 * @returns The property schema, or null.
 */
export function useProperty(name: string): PropertySchema | null {
  const property = useDesignStudioStore(
    useShallow((state) =>
      state.properties.find((candidate) => candidate.name === name),
    ),
  );

  return property || null;
}
