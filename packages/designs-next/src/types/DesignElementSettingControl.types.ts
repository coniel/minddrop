import type { ComponentType } from 'react';
import { DesignElement } from './DesignElement.types';

export interface DesignElementSettingControlProps<
  TElement extends DesignElement = DesignElement,
> {
  /**
   * The selected element the setting applies to.
   */
  element: TElement;

  /**
   * Callback fired with the changed setting values.
   */
  onChange: (settings: Partial<TElement>) => void;
}

/**
 * A control configuring one of an element's settings.
 */
export type DesignElementSettingControlComponent<
  TElement extends DesignElement = DesignElement,
> = ComponentType<DesignElementSettingControlProps<TElement>>;
