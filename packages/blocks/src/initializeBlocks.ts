import { Selection } from '@minddrop/selection';
import { deleteBlock } from './deleteBlock';
import { addBlocksToDataTransfer } from './addBlocksToDataTransfer';
import { getBlock } from './getBlock';
import { Block } from './types';

export function initializeBlocks(): void {
  Selection.registerItemType({
    id: 'block',
    onDelete(items) {
      items.forEach((item) => {
        deleteBlock(item.id);
      });
    },
    setDataOnDataTransfer(dataTrasnfer, items) {
      const blocks = items
        .map((item) => getBlock(item.id))
        .filter(Boolean) as Block[];

      addBlocksToDataTransfer(dataTrasnfer, blocks);
    },
  });
}
