import { View } from './View.types';

export interface ViewType {
  /**
   * A unique identifier for the view type. Used to reference the view type
   * in view instances.
   */
  type: string;

  /**
   * The name of the view type.
   */
  name: string;

  /**
   * The description of the view type.
   */
  description: string;

  /**
   * The component used to render the view.
   */
  component: React.ElementType<ViewTypeComponentProps>;
}

export interface ViewTypeComponentProps {
  /**
   * The view instance.
   */
  view: View;

  /**
   * IDs of the elements to render within the view.
   */
  elements: string[];
}
