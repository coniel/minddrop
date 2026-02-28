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
   * The default icon for views of this type.
   */
  icon: string;

  /**
   * The component used to render the view.
   */
  component: React.ElementType<ViewTypeComponentProps<TViewOptions>>;

  /**
   * The default options for the view type.
   */
  defaultOptions?: TViewOptions;

  /**
   * An optional component that renders a settings menu specific to this
   * view type. Receives the current view options and a callback to update them.
   */
  settingsMenu?: React.ElementType<ViewTypeSettingsMenuProps<TViewOptions>>;
}

export interface ViewTypeSettingsMenuProps<TViewOptions extends object = {}> {
  /**
   * The current view options.
   */
  options: TViewOptions;

  /**
   * Callback to update the view options. Accepts a partial options object
   * which will be merged with the current options.
   */
  onUpdateOptions: (options: Partial<TViewOptions>) => void;
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
