import type { ComponentType } from 'react';
import { DesignElement } from './DesignElement.types';

export interface DesignElementProps<
  TElement extends DesignElement = DesignElement,
> {
  /**
   * The design element to render.
   */
  element: TElement;

  /**
   * The elements it holds, which it places and renders itself.
   * Absent for an element holding none.
   */
  childElements?: DesignElement[];
}

export type DesignElementComponent<
  TElement extends DesignElement = DesignElement,
> = ComponentType<DesignElementProps<TElement>>;
