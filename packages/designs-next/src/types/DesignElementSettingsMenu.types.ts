import { DesignElement } from './DesignElement.types';

export interface DesignElementSettingsMenuProps<
  TElement extends DesignElement = DesignElement,
> {
  /**
   * The selected element the settings apply to.
   */
  element: TElement;

  /**
   * Callback fired with the changed settings values.
   */
  onSettingsChange: (settings: Partial<TElement>) => void;
}
