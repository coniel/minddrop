import { BlockClassifiersStore } from '../BlockClassifiersStore';
import { BlockVariantsStore } from '../BlockVariantsStore';

export function setup() {}

export function cleanup() {
  BlockClassifiersStore.clear();
  BlockVariantsStore.clear();
}
