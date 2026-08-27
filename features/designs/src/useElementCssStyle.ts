import { CSSProperties } from 'react';
import {
  DesignElementStyleSource,
  createElementCssStyle,
} from '@minddrop/designs';
import { useLayoutType } from './LayoutTypeContext';
import { useParentDirection } from './ParentDirectionContext';
import { useInsidePropertyChrome } from './PropertyChromeContext';

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
  const insidePropertyChrome = useInsidePropertyChrome();

  const css = createElementCssStyle(
    element,
    parentDirection,
    layoutType ?? undefined,
  );

  // Outside a property chrome wrapper the element carries its own
  // margins
  if (!insidePropertyChrome) {
    return css;
  }

  // Inside one, the wrapper owns the margins so they surround the
  // chrome rather than just the value
  const { marginTop, marginRight, marginBottom, marginLeft, ...chromeless } =
    css;

  return chromeless;
}
