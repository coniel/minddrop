import { Block } from '../types';
import { serializeBlocksToDataTransferData } from '../utils';

/**
 * Serializes the given blocks and sets the serialized data to the clipboard.
 *
 * @param blocks - The blocks to copy to the clipboard.
 */
export function copyBlocksToClipboard(blocks: Block[]): void {
  // Serialize the blocks
  const data = serializeBlocksToDataTransferData(blocks);

  // Create a Clipboard item with the serialized data
  const clipboardItem = new ClipboardItem(data);

  // Copy the data to the clipboard
  navigator.clipboard.write([clipboardItem]);
}
