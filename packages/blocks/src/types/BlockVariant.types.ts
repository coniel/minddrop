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
  component: React.ComponentType<BlockVariantProps<TBlock>>;

  /**
   * User friendly description of the block variant arranged as
   * a [language code]: { name: string } map.
   */
  description: Record<string, { name: string }>;

  /**
   * Class name to apply to the block container.
   */
  className?: string;
}

export interface BlockVariantProps<TBlock extends Block = Block> {
  /**
   * The block to render.
   */
  block: TBlock;

  /**
   * Whether the block is part of the current selection.
   */
  selected: boolean;

  /**
   * Callback to update the block.
   *
   * @param data - The data to update the block with.
   */
  updateBlock: (data: Partial<TBlock>) => void;

  /**
   * Callback to delete the block.
   */
  deleteBlock: () => void;
}
