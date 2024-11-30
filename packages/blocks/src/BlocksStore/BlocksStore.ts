import { create } from 'zustand';
import { Block } from '../types';

export interface BlocksStore {
  /**
   * The user's blocks.
   */
  blocks: Block[];

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
  blocks: [],

  load: (blocks) => set((state) => ({ blocks: [...state.blocks, ...blocks] })),

  add: (block) =>
    set((state) => {
      return {
        blocks: [...state.blocks, block],
      };
    }),

  update: (id, data) =>
    set((state) => {
      const index = state.blocks.findIndex((block) => block.id === id);
      const blocks = [...state.blocks];

      if (index === -1) {
        return {};
      }

      blocks[index] = { ...blocks[index], ...data };

      return { blocks };
    }),

  remove: (id) =>
    set((state) => {
      return {
        blocks: state.blocks.filter((block) => id !== block.id),
      };
    }),

  clear: () => set({ blocks: [] }),
}));

export function clearBlocks() {
  BlocksStore.getState().clear();
}
