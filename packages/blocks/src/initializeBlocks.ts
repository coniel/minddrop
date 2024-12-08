import { Selection } from '@minddrop/selection';
import { deleteBlock } from './deleteBlock';
import { getBlock } from './getBlock';
import { Block } from './types';
import { BLOCKS_DATA_KEY } from './constants';

export function initializeBlocks(): void {
  Selection.registerItemType({
    id: 'block',
    onDelete(items) {
      items.forEach((item) => {
        deleteBlock(item.id);
      });
    },
    serializeData(items) {
      const blocks = items
        .map((item) => getBlock(item.id))
        .filter(Boolean) as Block[];

      const text = blocks.map((block) => block.text).join('\n\n');

      return {
        [BLOCKS_DATA_KEY]: JSON.stringify(blocks),
        'text/plain': text,
      };
    },
  });
}
