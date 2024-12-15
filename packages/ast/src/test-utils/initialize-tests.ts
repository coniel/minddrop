import { ElementTypeConfigsStore } from '../ElementTypeConfigsStore';

export function cleanup(): void {
  // Clear the element type configs store
  ElementTypeConfigsStore.clear();
}
