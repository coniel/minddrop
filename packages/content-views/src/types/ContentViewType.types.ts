import { TranslationKey } from '@minddrop/i18n';
import { ContentIconName } from '@minddrop/ui-icons';
import { ContentView, ContentViewConfig } from './ContentView.types';
import { ViewDataSourceType } from './ViewDataSource.types';

export interface ContentViewType<
  TViewOptions extends object = object,
  TViewData extends object = object,
> {
  /**
   * A unique identifier for the content view type. Used to reference the content view type
   * in content view instances.
   */
  type: string;

  /**
   * The name of the content view type.
   */
  name: TranslationKey;

  /**
   * The description of the content view type.
   */
  description: TranslationKey;

  /**
   * The name of the content icon representing the content view type,
   * also used as the default icon of content views of this type.
   */
  icon: ContentIconName;

  /**
   * The types of data sources supported by the content view type.
   */
  supportedDataSources: ViewDataSourceType[];

  /**
   * Whether the view type renders its entries in a single order
   * the user can sort. View types which position entries
   * themselves are not sortable.
   */
  sortable?: boolean;

  /**
   * Whether the view type's entries can be narrowed by the view's
   * filters. View types showing every entry regardless are not
   * filterable.
   */
  filterable?: boolean;

  /**
   * The component used to render the content view.
   */
  component: React.ElementType<
    ContentViewTypeComponentProps<TViewOptions, TViewData>
  >;

  /**
   * The default options for the content view type.
   */
  defaultOptions?: TViewOptions;

  /**
   * The default data for the content view type.
   */
  defaultData?: TViewData;

  /**
   * Converts the item IDs within a view config into durable
   * references using the supplied conversion function, returning a
   * new config. Values the function cannot convert (null) are
   * dropped. View types whose options or data reference items must
   * implement this alongside `resolveReferences`.
   */
  serializeReferences?(
    config: ContentViewConfig<TViewOptions, TViewData>,
    convert: (id: string) => string | null,
  ): ContentViewConfig<TViewOptions, TViewData>;

  /**
   * Converts the durable references within a view config back into
   * item IDs using the supplied conversion function, returning a
   * new config. Values the function cannot convert (null) are
   * dropped.
   */
  resolveReferences?(
    config: ContentViewConfig<TViewOptions, TViewData>,
    convert: (reference: string) => string | null,
  ): ContentViewConfig<TViewOptions, TViewData>;

  /**
   * An optional component that renders a settings menu specific to this
   * content view type. Receives the current content view options and a callback to update them.
   */
  settingsMenu?: React.ElementType<
    ContentViewTypeSettingsMenuProps<TViewOptions, TViewData>
  >;

  /**
   * A component that renders a skeleton/placeholder version of the
   * content view type. Used in contexts like the design studio where no
   * real data is available.
   */
  skeletonComponent: React.ElementType;
}

export interface ContentViewTypeSettingsMenuProps<
  TViewOptions extends object = object,
  TViewData extends object = object,
> {
  /**
   * The content view instance.
   */
  view: ContentView<TViewOptions, TViewData>;

  /**
   * The current content view options.
   */
  options: TViewOptions;

  /**
   * Callback to update the content view options. Accepts a partial options object
   * which will be merged with the current options.
   */
  onUpdateOptions: (options: Partial<TViewOptions>) => void;
}

export interface ContentViewTypeComponentProps<
  TViewOptions extends object = object,
  TViewData extends object = object,
> {
  /**
   * The content view instance.
   */
  view: ContentView<TViewOptions, TViewData>;

  /**
   * IDs of the elements to render within the content view.
   */
  entries: string[];
}
