import { BlockElementParserConfigsStore } from '../BlockElementParserConfigsStore';

export function cleanup(): void {
  // Clear the BlockElementParserConfigsStore.
  BlockElementParserConfigsStore.clear();
}
