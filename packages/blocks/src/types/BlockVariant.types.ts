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
   * Whether or not the block should be draggable.
   */
  draggable: boolean;

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

  /**
   * Callback to select/deselect the block on click.
   *
   * Should be used as the `onClick` prop of the block container
   * or a drag handle at the top of the block.
   *
   * Note that this callback will do nothing if the block should
   * not be selectable.
   */
  toggleSelected: (event: React.MouseEvent) => void;

  /**
   * Callback to be fired when the block is dragged.
   *
   * Should be used as the `onDragStart` prop of the block container.
   */
  onDragStart: (event: DragEvent | React.DragEvent) => void;
}
