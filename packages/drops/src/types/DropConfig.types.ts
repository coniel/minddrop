import { Core, DataInsert } from '@minddrop/core';
import { CreateDropData, Drop, DropParentReference } from './Drop.types';

export interface DropComponentProps extends Drop {
  /**
   * The parent reference of the parent inside which the
   * component is being rendered.
   *
   * For example, when rendered inside a topic view, the
   * parent would be { type: 'topic', id: 'topic-id' }.
   */
  parent?: DropParentReference;
}

export interface DropConfig<
  T extends Drop = Drop,
  D extends CreateDropData = CreateDropData,
> {
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
   * The data types from which this kind of drop can be created.
   * Omit if this drop type does not support data.
   */
  dataTypes?: string[];

  /**
   * The file types from which this kind of drop can be created.
   * Omit if this drop type does not support files.
   */
  fileTypes?: string[];

  /**
   * If `true`, indicates that this drop type supports multiple
   * files at once.
   */
  multiFile?: boolean;

  /**
   * If `true`, this drop type requires data for creation.
   */
  requiresData?: boolean;

  /**
   * If `true`, this drop type requires a file for creation.
   */
  requiresFile?: boolean;

  /**
   * Creates a new drop of this type.
   * Should use the `Drops.create` internally to create the drop.
   *
   * @param core A MindDrop core instance.
   * @param data The data from which the drop is to be created.
   * @returns A promise which resolves to the new drop.
   */
  create(core: Core, data?: DataInsert): D | Promise<D>;

  /**
   * Called when data is dropped or pasted onto the drop.
   * Omit if updating the drop using data is not supported.
   * Should use `Drops.update` internally to update the drop.
   *
   * @param core A MindDrop core instance.
   * @param drop The drop into which the data was inserted.
   * @param data The data inserted into the drop.
   * @returns A promsie which resolves to the updated drop (or original drop if it was not updated).
   */
  insertData?(core: Core, drop: Drop, data: DataInsert): Promise<Drop>;

  /**
   * The component used to render the drop.
   */
  component: React.ComponentType<{ parent?: DropParentReference } & T>;
}

export interface RegisteredDropConfig<T extends Drop = Drop>
  extends DropConfig<T> {
  /**
   * The ID of the extension that registered the drop type.
   */
  extension: string;
}
