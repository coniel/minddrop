import { ComponentType } from 'react';

export interface View {
  /**
   * The unique ID of the view.
   */
  id: string;

  /**
   * The ID of the extension that registered the view.
   */
  extension: string;

  /**
   * The type of view.
   * - `static` views simply render the provided component.
   * - `instance` views are rendered using a persistently
   *    stored view document passed in to the component.
   */
  type: 'static' | 'instance';

  /**
   * The component rendered by the view.
   */
  component: ComponentType;
}
