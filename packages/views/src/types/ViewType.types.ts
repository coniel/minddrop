import { TranslationKey } from '@minddrop/i18n';
import { View } from './View.types';
import { ViewDataSourceType } from './ViewDataSource.types';

export interface ViewType<
  TViewOptions extends object = object,
  TViewData extends object = object,
> {
  /**
   * A unique identifier for the view type. Used to reference the view type
   * in view instances.
   */
  type: string;

  /**
   * The name of the view type.
   */
  name: TranslationKey;

  /**
   * The description of the view type.
   */
  description: TranslationKey;

  /**
   * The default icon for views of this type.
   */
  icon: string;

  /**
   * The types of data sources supported by the view type.
   */
  supportedDataSources: ViewDataSourceType[];

  /**
   * The component used to render the view.
   */
  component: React.ElementType<ViewTypeComponentProps<TViewOptions, TViewData>>;

  /**
   * The default options for the view type.
   */
  defaultOptions?: TViewOptions;

  /**
   * The default data for the view type.
   */
  defaultData?: TViewData;

  /**
   * An optional component that renders a settings menu specific to this
   * view type. Receives the current view options and a callback to update them.
   */
  settingsMenu?: React.ElementType<ViewTypeSettingsMenuProps<TViewOptions>>;

  /**
   * A component that renders a skeleton/placeholder version of the
   * view type. Used in contexts like the design studio where no
   * real data is available.
   */
  skeletonComponent: React.ElementType;
}

export interface ViewTypeSettingsMenuProps<
  TViewOptions extends object = object,
  TViewData extends object = object,
> {
  /**
   * The view instance.
   */
  view: View<TViewOptions, TViewData>;

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

export interface ViewTypeComponentProps<
  TViewOptions extends object = object,
  TViewData extends object = object,
> {
  /**
   * The view instance.
   */
  view: View<TViewOptions, TViewData>;

  /**
   * IDs of the elements to render within the view.
   */
  entries: string[];
}
