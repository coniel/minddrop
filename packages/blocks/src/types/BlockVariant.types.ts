import { Block } from './Block.types';

export interface BlockVariant<TBlock extends Block = Block> {
  /**
   * A unique id for the renderer. Blocks will use this as their
   * 'display' property to select the renderer to use.
   */
  id: string;

  /**
   * The block type that this renderer will be used for.
   */
  blockType: string;

  /**
   * The component used to render the block.
   */
  component: React.ComponentType<BlockRendererProps<TBlock>>;

  /**
   * User friendly description of the block variant arranged as
   * a [language code]: { name: string } map.
   */
  description: Record<string, { name: string }>;
}

export interface BlockRendererProps<TBlock extends Block = Block> {
  /**
   * The block to render.
   */
  block: TBlock;

  /**
   * Callback to update the block.
   *
   * @param block - The updated block.
   */
  onChange: (block: TBlock) => void;

  /**
   * Callback to delete the block.
   *
   * @param block - The block to delete.
   */
  onDelete: (block: TBlock) => void;
}
