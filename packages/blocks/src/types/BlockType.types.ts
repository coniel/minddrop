import { BlockData } from './Block.types';
import { BlockPropertiesSchema } from './BlockPropertiesSchema.types';

export interface BlockType<TData extends BlockData = {}> {
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
   * User frienfly description of the block type arranged as a
   * [language code]: { name: string, details: string } map.
   */
  description: Record<string, BlockDescription>;

  /**
   * The block's custom properties schema.
   */
  propertiesSchema?: BlockPropertiesSchema;

  /**
   * The initial properties for anew block instance of this
   * type.
   */
  initialProperties?: TData;
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
