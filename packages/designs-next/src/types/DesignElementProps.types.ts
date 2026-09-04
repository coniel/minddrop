import type { ComponentType } from 'react';
import { DesignElement } from './DesignElement.types';

export interface DesignElementProps<
  TElement extends DesignElement = DesignElement,
> {
  /**
   * The design element to render.
   */
  element: TElement;
}

export type DesignElementComponent<
  TElement extends DesignElement = DesignElement,
> = ComponentType<DesignElementProps<TElement>>;
