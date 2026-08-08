import { SelectionItem } from '@minddrop/selection';
import { Editor } from './Editor.types';

/**
 * The type of selection item representing an editor block.
 */
export const BLOCK_SELECTION_ITEM_TYPE = 'editor-block';

export interface BlockSelectionItemData {
  /**
   * The editor the block belongs to, used to act on the block from
   * outside the editor which selected it.
   */
  editor: Editor;

  /**
   * The block's session scoped ID.
   *
   * The block's path is deliberately not carried, changing as the
   * document does, and is resolved from the ID when needed.
   */
  blockId: string;
}

export type BlockSelectionItem = SelectionItem<BlockSelectionItemData>;
