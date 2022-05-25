import { Core, DataInsert } from '@minddrop/core';
import {
  RegisteredResourceTypeConfig,
  ResourceReference,
  ResourceTypeConfig,
} from '@minddrop/resources';
import { Drop, DropBaseData, DropTypeData, DropUpdate } from './Drop.types';

export type DropComponentProps<TData extends DropTypeData = {}> = Drop<
  TData & {
    /**
     * The parent reference of the parent inside which the
     * component is currently being rendered.
     *
     * For example, when rendered inside a topic view, the
     * parent would be { type: 'topic', id: 'topic-id' }.
     */
    currentParent?: ResourceReference;
  }
>;

export interface DropTypeConfigOptions<TData extends DropTypeData = {}> {
  /**
   * The drop type.
   */
  type: string;

  /**
   * The name of the drop type. Displayed to users.
   */
  name: string;

  /**
   * A short description of the drop type. Displayed to users.
   */
  description: string;

  /**
   * The component used to render the drop.
   */
  component: React.ComponentType<DropComponentProps<TData>>;

  /**
   * The default data used when creating a new drop of this type.
   * The data supplied to the `create` method is merged into
   * the default data, overwriting any overlaping values.
   *
   * For more advanced needs, such as modifying the default
   * data based on the data provided to the `create` method,
   * use the `onCreate` callback.
   */
  defaultData?: Partial<TData>;

  /**
   * The data types from which this kind of drop can be created (e.g.
   * 'text/plain'). Used to decide which type of drop to create when data
   * is inserted into the editor (e.g. from a paste event).
   *
   * When a data insert contains a matching data type, the `initializeData` method will
   * be called with the inserted data. If there are multiple registered drop types that
   * support the same data type, only a single drop will be created (the drop type that
   * was registered first).
   *
   * Omit if this drop type does not support being created from data.
   */
  dataTypes?: string[];

  /**
   * The file types from which this kind of element can be created (e.g.
   * 'image/png'). Used to decide which type of element to create when data
   * containing files is inserted into the editor (e.g. from a paste event).
   *
   * When a data insert contains a matching file type, the `initializeData` method will
   * be called with the inserted file(s). If there are multiple registered rich
   * text element types that support the same file type, only a single element
   * will be created (the element type that was registered first).
   *
   * Omit if this element type does not support files.
   */
  fileTypes?: string[];

  /**
   * The domains from which this type of drop can be created. Used to decide
   * which type of drop to create when a URL is inserted into the editor.
   *
   * Values can be either domains, such as 'minddrop.app' (which also matches
   * 'www.minddrop.app'), 'docs.minddrop.app' to match a specific subdomain,
   * '*.minddrop.app' to match any subdomain, or 'minddrop.*' to match any TLD.
   *
   * For more control over the matching, a function can be provided which receives
   * the URL and returns a boolean indicating a match.
   */
  domains?: (string | ((url: string) => boolean))[];

  /**
   * Determnies the behaviour when creating drops of this type from files.
   *
   * When `true`, indicates that this drop type supports multiple
   * files at once, resulting in the config's `initializeData` method being called
   * once with all supported files included in the `data` parameter.
   *
   * When `false`, indicates that this drop type only supports a single
   * file per element. In this case, the `initializeData` method will called for each
   * inserted file, with a signle file being included in the `data` parameter.
   */
  multiFile?: boolean;

  /**
   * Called when creating a new drop of this type from a `DataInsert`. Should
   * return an object containing the initial state of the custom data used
   * in the drop. Initialized data is merged into the drop type's `defaultData`.
   *
   * Omit if the drop does not use custom data.
   *
   * If the drop is being created as the result of a data insert (such as a
   * paste event), the `data` parameter will contain the inserted data.
   *
   * @param data - A data insert object.
   * @returns The drop's custom data.
   */
  initializeData?(data?: DataInsert): TData;

  /**
   * Called when a drop of this type is duplicated. Should return an object
   * containing a duplicate of the custom data used in the drop.
   *
   * Omit if the data can be duplicated directly without any needing to be
   * modified.
   */
  duplicateData?(drop: Drop<TData>): TData;

  /**
   * Called when an existing drop of a different type is converted into
   * this type (e.g. converting a 'text' drop into an 'equation' drop).
   * Should return an object containing the initial state of custom
   * data used in the drop.
   *
   * Omit if the drop does not need to perform additional logic during
   * type conversions.
   *
   * @param drop - The drop being converted.
   * @returns The new drop type's custom data.
   */
  convertData?(drop: Drop): TData;

  /**
   * Callback fired when a drop of this type is created. Called before
   * the document is inserted into the store and database. Allows for
   * performing modifications and validation on the document data
   * before creation.
   *
   * Must return the new document of this drop type.
   *
   * @param drop - The new drop document.
   * @returns The new drop document, with modifications.
   */
  onCreate?(core: Core, document: Drop<TData>): Drop<TData>;

  /**
   * Callback fired when a drop of ths type is updated. Called before
   * the document changes are set to the store and database. Allows
   * for performing modifications and validation on the document before
   * it is updated.
   *
   * Must return the updated drop document.
   *
   * @param update - The drop update data.
   * @returns The modified drop update data.
   */
  onUpdate?(core: Core, update: DropUpdate<TData>): Partial<TData>;

  /**
   * Callback fired when a drop of this type is retrieved
   * from the store. Allows for performing modifications to the
   * document before it is returned. When multiple documents are
   * fetched at once, the callback is called on each returned
   * document.
   *
   * @param drop - The requested drop.
   * @returns The requested drop.
   */
  onGet?(drop: Drop<TData>): Drop<TData>;

  /**
   * Callback fired when the drops store is cleared. Only called
   * within tests. Allows for performing side effects such
   * as clearning other related data.
   */
  onClear?(): void;
}

export type DropTypeConfig<TData extends DropTypeData = {}> =
  ResourceTypeConfig<DropBaseData, TData, DropTypeConfigOptions<TData>>;

export type RegisteredDropTypeConfig<TData extends DropTypeData = {}> =
  RegisteredResourceTypeConfig<DropBaseData, TData, DropTypeConfigOptions>;
