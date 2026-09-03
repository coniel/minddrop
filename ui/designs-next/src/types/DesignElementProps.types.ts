import type { ComponentType } from 'react';
import { DesignElement } from '@minddrop/designs-next';

export interface DesignElementProps {
  /**
   * The design element to render.
   */
  element: DesignElement;
}

export type DesignElementComponent = ComponentType<DesignElementProps>;
