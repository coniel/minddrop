import { Block } from '@minddrop/blocks';
import { Document } from './Document.types';
import { DocumentView } from './DocumentView.types';

export interface DocumentViewProps<TView extends DocumentView = DocumentView> {
  /**
   * The document.
   */
  document: Document;

  /**
   * The view instance.
   */
  view: TView;

  /**
   * Callback to add blocks to the document.
   *
   * @param blocks - The blocks to add.
   */
  addBlocks: (blocks: Block[]) => void;

  /**
   * Callback to update a block in the document.
   *
   * @param id - The block ID.
   * @param data - The block data to update.
   */
  updateBlock: (id: string, data: Partial<Block>) => void;

  /**
   * Callback to create blocks from a data transfer.
   *
   * @param data - The data transfer object from a paste or drag event.
   */
  createBlocksFromDataInsert: (data: DataTransfer) => Promise<Block[]>;

  /**
   * Callback to remove blocks from the document.
   *
   * @param ids - The IDs of the blocks to remove.
   */
  removeBlocks: (ids: string[]) => void;

  /**
   * Callback to update the document.
   */
  updateDocument(data: Partial<Document>): Promise<void>;

  /**
   * Callback to update the view data.
   */
  updateView(data: Partial<TView>): Promise<void>;
}
