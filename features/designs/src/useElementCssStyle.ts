import { CSSProperties } from 'react';
import {
  DesignElementStyleSource,
  createElementCssStyle,
} from '@minddrop/designs';
import { useLayoutType } from './LayoutTypeContext';
import { useParentDirection } from './ParentDirectionContext';

/**
 * Emits the CSS of a design element as its containing element lays
 * it out, so that filling the height fills the height whichever way
 * that container stacks its children, resolved against the
 * surrounding layout's type.
 *
 * @param element - The element to emit CSS for.
 * @returns The element's CSS properties.
 */
export function useElementCssStyle(
  element: DesignElementStyleSource,
): CSSProperties {
  const parentDirection = useParentDirection();
  const layoutType = useLayoutType();

  return createElementCssStyle(
    element,
    parentDirection,
    layoutType ?? undefined,
  );
}
