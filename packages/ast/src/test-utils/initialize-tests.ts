import { BlockElementConfigsStore } from '../BlockElementConfigsStore';

export function cleanup(): void {
  // Clear the block element configs store
  BlockElementConfigsStore.clear();
}
