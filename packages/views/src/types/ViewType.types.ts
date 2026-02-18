import { View } from './View.types';

export interface ViewType<TViewOptions extends object = {}> {
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
  component: React.ElementType<ViewTypeComponentProps<TViewOptions>>;

  /**
   * The default options for the view type.
   */
  defaultOptions?: TViewOptions;
}

export interface ViewTypeComponentProps<TViewOptions extends object = {}> {
  /**
   * The view instance.
   */
  view: View<TViewOptions>;

  /**
   * IDs of the elements to render within the view.
   */
  entries: string[];
}
