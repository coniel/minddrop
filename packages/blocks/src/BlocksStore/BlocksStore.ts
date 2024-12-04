import { create } from 'zustand';
import { Block } from '../types';

export interface BlocksStore {
  /**
   * The user's blocks.
   */
  blocks: Record<string, Block>;

  /**
   * Load blocks into the store.
   */
  load(block: Block[]): void;

  /**
   * Add a block to the store.
   */
  add(block: Block): void;

  /**
   * Updates a block in the store by id.
   */
  update(id: string, data: Partial<Block>): void;

  /**
   * Remove a block from the store by id.
   */
  remove(id: string): void;

  /**
   * Clear the store.
   */
  clear(): void;
}

export const BlocksStore = create<BlocksStore>()((set) => ({
  blocks: {},

  load: (blocks) =>
    set((state) => ({
      blocks: {
        ...state.blocks,
        ...blocks.reduce((blks, block) => ({ ...blks, [block.id]: block }), {}),
      },
    })),

  add: (block) =>
    set((state) => {
      return {
        blocks: { ...state.blocks, [block.id]: block },
      };
    }),

  update: (id, data) =>
    set((state) => {
      const blocks = { ...state.blocks };
      const block = state.blocks[id];

      if (!block) {
        return {};
      }

      blocks[id] = { ...block, ...data };

      return { blocks };
    }),

  remove: (id) =>
    set((state) => {
      const blocks = { ...state.blocks };

      delete blocks[id];

      return {
        blocks,
      };
    }),

  clear: () => set({ blocks: {} }),
}));

export function clearBlocks() {
  BlocksStore.getState().clear();
}
