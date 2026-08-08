import { TranslationKey } from '@minddrop/i18n';
import { DataView, DataViewConfig } from './DataView.types';
import { ViewDataSourceType } from './ViewDataSource.types';

export interface DataViewType<
  TViewOptions extends object = object,
  TViewData extends object = object,
> {
  /**
   * A unique identifier for the data view type. Used to reference the data view type
   * in data view instances.
   */
  type: string;

  /**
   * The name of the data view type.
   */
  name: TranslationKey;

  /**
   * The description of the data view type.
   */
  description: TranslationKey;

  /**
   * The default icon for data views of this type.
   */
  icon: string;

  /**
   * The types of data sources supported by the data view type.
   */
  supportedDataSources: ViewDataSourceType[];

  /**
   * The component used to render the data view.
   */
  component: React.ElementType<
    DataViewTypeComponentProps<TViewOptions, TViewData>
  >;

  /**
   * The default options for the data view type.
   */
  defaultOptions?: TViewOptions;

  /**
   * The default data for the data view type.
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
    config: DataViewConfig<TViewOptions, TViewData>,
    convert: (id: string) => string | null,
  ): DataViewConfig<TViewOptions, TViewData>;

  /**
   * Converts the durable references within a view config back into
   * item IDs using the supplied conversion function, returning a
   * new config. Values the function cannot convert (null) are
   * dropped.
   */
  resolveReferences?(
    config: DataViewConfig<TViewOptions, TViewData>,
    convert: (reference: string) => string | null,
  ): DataViewConfig<TViewOptions, TViewData>;

  /**
   * An optional component that renders a settings menu specific to this
   * data view type. Receives the current data view options and a callback to update them.
   */
  settingsMenu?: React.ElementType<
    DataViewTypeSettingsMenuProps<TViewOptions, TViewData>
  >;

  /**
   * A component that renders a skeleton/placeholder version of the
   * data view type. Used in contexts like the design studio where no
   * real data is available.
   */
  skeletonComponent: React.ElementType;
}

export interface DataViewTypeSettingsMenuProps<
  TViewOptions extends object = object,
  TViewData extends object = object,
> {
  /**
   * The data view instance.
   */
  view: DataView<TViewOptions, TViewData>;

  /**
   * The current data view options.
   */
  options: TViewOptions;

  /**
   * Callback to update the data view options. Accepts a partial options object
   * which will be merged with the current options.
   */
  onUpdateOptions: (options: Partial<TViewOptions>) => void;
}

export interface DataViewTypeComponentProps<
  TViewOptions extends object = object,
  TViewData extends object = object,
> {
  /**
   * The data view instance.
   */
  view: DataView<TViewOptions, TViewData>;

  /**
   * IDs of the elements to render within the data view.
   */
  entries: string[];
}
