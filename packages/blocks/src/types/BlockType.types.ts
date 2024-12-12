import { ContentIconName } from '@minddrop/icons';
import { Block, CustomBlockData } from './Block.types';
import { BlockPropertiesSchema } from './BlockPropertiesSchema.types';

export interface BlockType<TData extends CustomBlockData = CustomBlockData> {
  /**
   * A unique identifier for the block type. Used as the block's
   * type property.
   * */
  id: string;

  /**
   * The variant used to render the block if no variant
   * is specified on the block instance.
   *
   * Must be the ID of a registered variant.
   */
  defaultVariant: string;

  /**
   * User friendly description of the block type arranged as a
   * [language code]: { name: string, details: string } map.
   */
  description: Record<string, BlockDescription>;

  /**
   * The icon used to represent the block type.
   */
  icon: ContentIconName;

  /**
   * The block's custom properties schema.
   */
  propertiesSchema?: BlockPropertiesSchema;

  /**
   * The initial properties for anew block instance of this
   * type.
   */
  initialProperties?: TData;

  /**
   * Callback used to asynchronously update a new block after creation.
   *
   * This can be useful for fetching metadata from the web or other async operations that
   * need to be performed when a new block of this type is created.
   *
   * Receives the new block, including the initial properties.
   *
   * @param block - The block in its initial state.
   */
  onCreate?: (block: Block<TData>) => Promise<void>;
}

interface BlockDescription {
  /**
   * Name displayed in the UI.
   */
  name: string;

  /**
   * Short description displayed in the UI.
   */
  details: string;
}
